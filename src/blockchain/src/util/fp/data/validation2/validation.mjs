// https://folktale.origamitower.com/docs/v2.3.0/migrating/from-data.validation/
import Applicative from '../contract/Applicative.mjs'
import Functor from '../contract/Functor.mjs'
import Monad from '../contract/Monad.mjs'
export default class Validation {
  #val
  constructor(value) {
    this.#val = value // detect if called from a derived, otherwise throw exception new.target ?
    if (![Success.name, Failure.name].includes(new.target.name)) {
      throw new Error(
        `Can't directly constructor a Validation. Please use constructor Validation.of`
      )
    }
  }

  get() {
    return this.#val
  }

  /**
   * Type lifting
   *
   * @param {Object} value Any value
   * @return {Success} Success branch with value
   */
  static of(value) {
    return Validation.Success(value)
  }

  /**
   * Returns the success branch (right bias)
   *
   * @param {Object} a Any value
   * @return {Success} Success
   */
  static Success(a) {
    return Success.of(a)
  }

  /**
   * Returns the left (failure) branch
   *
   * @param {string} error Error message
   * @return {Failure} Failure discriminant
   */
  static Failure(error) {
    return Failure.of(error)
  }

  get isSuccess() {
    return false
  }

  get isFailure() {
    return false
  }

  equals(otherValidation) {
    return this.#val === otherValidation.get()
  }

  getOrElse(defaultVal) {
    return this.#val || defaultVal
  }

  toString() {
    return `${this.constructor.name} (${this.#val
  })`
  }

  [Symbol.toPrimitive](hint) {
    return this.get()
  }
}

export class Success extends Validation {
  static of(a) {
    return new Success(a)
  }

  get isSuccess() {
    return true
  }
}

Object.assign(Success.prototype, Applicative(), Functor(), Monad())

export class Failure extends Validation {
  get isFailure() {
    return true
  }

  static of(b) {
    return new Failure(b)
  }

  get() {
    throw new Error(`Can't extract the value of a Failure`)
  }

getOrElse(defaultVal) {
  return defaultVal
}
}

Failure.SHORT_CIRCUIT = true
Object.assign(
  Failure.prototype,
  Applicative(Failure.SHORT_CIRCUIT),
  Functor(Failure.SHORT_CIRCUIT),
  Monad(Failure.SHORT_CIRCUIT)
)
