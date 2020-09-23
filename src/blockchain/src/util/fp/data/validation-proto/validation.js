import Functor from '../contract/Functor.js'
import Monad from '../contract/Monad.js'

const _val = Symbol('val');
function Validation(val) {
  if (new.target) {
    throw new TypeError(`Can't directly instantiate a Validation. Please use constructor Validation.of`);
  }
  this[_val] = val;
}
Validation.prototype.get = function () {
  return this[_val];
}
Validation.prototype.isSuccess = Validation.prototype.isFailure = false;
Validation.prototype.getOrElse = function (defaultVal) {
  return this[_val] ?? defaultVal;
};
Validation.prototype.toString = function () {
  return `${this.constructor.name} (${this.get()})`;
};
Validation.prototype[Symbol.toPrimitive] = function (hint) {
  return this[_val];
};
Validation.prototype[Symbol.iterator] = function* () {
  yield this.isFailure ? Failure.of(this[_val]) : undefined;
  yield this.isSuccess ? Success.of(this[_val]) : undefined;
};

// Success branch
function Success(val) {
  Validation.call(this, val);
}
Success.prototype = Object.create(Validation.prototype);
Success.prototype.constructor = Success;
Success.prototype.isSuccess = true;
Object.assign(Success.prototype, Functor, Monad)
Success.of = function (val) {
  return new Success(val)
}

// Failure branch
function Failure(error) {
  Validation.call(this, error);
}
Failure.prototype = Object.create(Validation.prototype);
Failure.prototype.constructor = Failure;
Failure.prototype.isFailure = true;
Failure.prototype.get = () => throw new TypeError(`Can't extract the value of a Failure`);
  Failure.prototype.getOrElse = function (defaultVal) {
    return defaultVal;
  }
  Failure.of = function (val) {
    return new Failure(val);
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
  };
  Object.assign(
    Failure.prototype,
    NoopFunctor,
    NoopMonad
  );

  // Static helpers
  Validation.of = function (val) {
    return Success.of(val);
  }
  Validation.Success = Success.of;
  Validation.Failure = Failure.of;

  export default Validation;
  export { Success, Failure };
