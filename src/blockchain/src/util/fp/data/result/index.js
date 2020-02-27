/* eslint fp/no-mutation:0,fp/no-throw:0 */
import { Failure, Success } from '../validation/index.js'
import { identity, isFunction } from '../../combinators.js'

const Result = {
  '@@type': 'Result',
  '@@implements': ['of', 'map', 'ap', 'fold', 'flatMap', 'merge'],
  of: b => Ok(b)
}

export const Error = (Result.Error = a =>
  Object.assign(
    {
      [Symbol.for('validation')]: () => Failure([a]),
      isOk: () => false,
      isError: () => true,
      map: _ => Error(a),
      flatMap: fn => Error(a),
      ap: Ea => Error(a),
      fold: _ => Error(a),
      get: () => errorWith('Unable to get from a Result.Error'),
      merge: () => errorWith('Unable to merge from a Result.Error'),
      toValidation: () => Failure(a),
      getOrElse: defaultValue => defaultValue,
      getOrElseThrow: () => {
        throw new Error(a)
      },
      orElseThrow: () => {
        throw new Error(a)
      },
      toString: () => `Result#Error (${a})`,
      toJSON: () => ({
        type: 'Result#Error',
        value: a
      })
    },
    Result
  ))

export const Ok = (Result.Ok = b =>
  Object.assign(
    {
      [Symbol.for('validation')]: () => Success(b),
      isOk: () => true,
      isError: () => false,
      fold: (fn = identity) => fn(b),
      map: fn => Result.fromNullable(fn(b)),
      flatMap: fn => Result.fromNullable(fn(b).merge()),
      ap: Eb =>
        Eb.isError()
          ? // If applying to a Result.Error, skip
            Eb
          : // Applying a Result.Ok
          isFunction(b)
          ? // If b is a function, look at the contents of Eb
            Result.of(
              isFunction(Eb.merge())
                ? // If Eb holds another function, fold Eb with b
                  Eb.merge().call(Eb, b)
                : // Eb holds a value, apply that value to b
                  b(Eb.merge())
            )
          : // b is a value and Eb has a function
            Result.of(Eb.merge().call(Eb, b)),
      get: () => b,
      getOrElse: _ => b,
      getOrElseThrow: error => b,
      orElseThrow: error => Ok(b),
      merge: () => b,
      toValidation: () => Success(b),
      toString: () => `Result#Ok (${b})`,
      toJSON: () => ({
        type: 'Result#Ok',
        value: b
      })
    },
    Result
  ))

const errorWith = str => {
  // This will become more concise with throw expressions (https://github.com/tc39/proposal-throw-expressions)
  throw new TypeError(str)
}

Result.fromNullable = (a, error = 'Null argument provided') => (a != null ? Ok(a) : Error(error))
Result.fromEmpty = a => Result.fromNullable(a).map(x => (x.length === 0 ? null : x))
Result.fromValidation = Va => () => {
  if (Va['@@type'] === 'Validation') {
    if (Va.isSuccess()) {
      return Ok(Va.merge())
    }
    return Error(Va.merge())
  }
  return Result.fromNullable(Va)
}

export default Result
