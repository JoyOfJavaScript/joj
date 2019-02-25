import Applicative from '../contract/Applicative'
import Functor from '../contract/Functor'
import Monad from '../contract/Monad'

// https://folktale.origamitower.com/docs/v2.3.0/migrating/from-data.validation/
export default class Validation {
  #tag = 'Validation'
  constructor (value) {
    this._val = value // detect if called from a derived, otherwise throw exception new.target ?
    if (![Success.name, Failure.name].includes(new.target.name)) {
      throw new Error(
        `Can't directly constructor a Validation. Please use constructor Validation.of`
      )
    }
  }

  get value () {
    return this._val
  }

  /**
   * Type lifting
   *
   * @param {Object} value Any value
   * @return {Success} Success branch with value
   */
  static of (value) {
    return this.Success(value)
  }

  /**
   * Returns the success branch (right bias)
   *
   * @param {Object} a Any value
   * @return {Success} Success
   */
  static Success (a) {
    return Success.of(a)
  }

  /**
   * Returns the left (failure) branch
   *
   * @param {Array} b Array containing a failure validation message
   * @return {Success} Failure
   */
  static Failure (b) {
    return Failure.of(b)
  }

  get isSuccess () {
    return false
  }

  get isFailure () {
    return false
  }

  isEqual (otherValidation) {
    // TODO:
  }

  unsafeGet () {
    return this.value
  }

  getOrElse () {}

  get [Symbol.for('implements')] () {
    return ['map', 'ap', 'flatMap', 'chain', 'bind']
  }

  get tag () {
    return this.#tag
  }

  toString () {
    return `${this.tag} (${this.value})`
  }
}

export class Success extends Validation {
  #tag = 'Success'
  constructor (a) {
    super(a)
  }

  static of (a) {
    return new Success(a)
  }

  get isSuccess () {
    return true
  }

  get tag () {
    return this.#tag
  }
}

export class Failure extends Validation {
  #tag = 'Failure'
  constructor (b) {
    super(b)
  }

  get isFailure () {
    return true
  }

  static of (b) {
    return new Failure(b)
  }

  unsafeGet () {
    throw new Error(`Can't extract the value of a Failure`)
  }

  get tag () {
    return this.#tag
  }
}

Object.assign(Validation.prototype, Applicative(), Functor(), Monad())
