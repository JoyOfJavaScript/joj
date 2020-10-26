// https://folktale.origamitower.com/docs/v2.3.0/migrating/from-data.validation/
import Applicative from '../contract/Applicative.js'
import Functor from '../contract/Functor.js'
import Monad from '../contract/Monad.js'
export default class Validation {
  #val
  constructor(value) {
    this.#val = value // detect if called from a derived, otherwise throw exception new.target ?
    if (![Success.name, Failure.name].includes(new.target.name)) {
      throw new Error(
        `Can't directly instantiate a Validation. Please use constructor Validation.of`
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

  getOrElse(defaultVal) {
    return this.isSuccess ? this.#val: defaultVal;
  }

  toBoolean() {
    return this.isSuccess
  }

  toString() {
    return `${this.constructor.name} (${this.#val
  })`;
  }

  [Symbol.toPrimitive](hint) {
    return this.get()
  }

  * [Symbol.iterator] () {
    yield this.isFailure ? Failure.of(this.#val) : undefined
    yield this.isSuccess ? Success.of(this.#val) : undefined 
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

Object.assign(Success.prototype, Applicative(), Functor, Monad)

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

const NoopFunctor = {
  map() {
    return this;
  }
}

const NoopMonad = {
  flatMap(f) {
    return this;
  },
  chain(f) {
    //#B
    return this.flatMap(f);
  },
  bind(f) {
    //#B
    return this.flatMap(f);
  }
}

Failure.SHORT_CIRCUIT = true
Object.assign(
  Failure.prototype,
  Applicative(Failure.SHORT_CIRCUIT),
  NoopFunctor,
  NoopMonad
)
