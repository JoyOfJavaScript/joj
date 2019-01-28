import map from '../adt/map'

// https://folktale.origamitower.com/docs/v2.3.0/migrating/from-data.validation/
export default class Validation {
  #value = undefined
  #tag = 'Validation'
  constructor (value) {
    this.#value = value // detect if called from a derived, otherwise throw exception new.target ?
    if (![Success.name, Failure.name].includes(new.target.name)) {
      throw new Error(
        `Can't directly constructor a Validation. Please use constructor Validation.of`
      )
    }
  }

  /**
   * Returns the success branch
   *
   * @param {Object} a Any value
   * @return {Success} Success
   */
  static Success (a) {
    return Object.assign(new Success(a), map)
  }

  static Failure (b) {
    return Object.assign(new Failure(b), map)
  }

  get isSuccess () {
    return false
  }

  get isFailure () {
    return false
  }

  isEqual (otherValidation) {}

  unsafeGet () {
    return this.#value
  }

  getOrElse () {}
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

  get [Symbol.for('implements')] () {
    return ['map']
  }

  [Symbol.iterator] () {
    return Array
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

  unsafeGet () {
    throw new Error(`Can't extract the value of a Failure`)
  }

  get tag () {
    return this.#tag
  }

  get [Symbol.for('implements')] () {
    return ['']
  }
}
