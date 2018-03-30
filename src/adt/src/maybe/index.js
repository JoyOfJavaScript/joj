import { isFunction, identity } from '../combinators'
import { Success, Failure } from '../validation'

const Maybe = {
  '@@type': 'Maybe',
  of: a => Just(a)
}

export const Just = (Maybe.Just = a =>
  Object.assign(
    {
      isJust: () => true,
      isNothing: () => false,
      fold: (fn = identity) => fn(a),
      map: fn => Maybe.fromNullable(fn(a)),
      ap: Ma =>
        Ma.isNothing()
          ? // If applying to a Maybe.Nothing, skip
            Nothing()
          : // Applying a Maybe.Just
            isFunction(a)
            ? // If a is a function, look at the contents of Ma
              Maybe.of(
                isFunction(Ma.merge())
                  ? // If Ma holds another function, fold Ma with a
                    Ma.merge().call(Ma, a)
                  : // Ma holds a value, apply that value to a
                    a(Ma.merge())
              )
            : // a is a value and Ma has a function
              Maybe.of(Ma.merge().call(Ma, a)),
      get: () => a,
      getOrElse: _ => a,
      getOrElseThrow: error => a,
      orElseThrow: error => Just(a),
      merge: () => a,
      toValidation: () => Success(a)
    },
    Maybe
  ))

export const Nothing = (Maybe.Nothing = b =>
  Object.assign(
    {
      isJust: () => false,
      isNothing: () => true,
      map: _ => Nothing(),
      ap: Ma => Nothing(),
      fold: _ => errorWith('Unable to fold from a Maybe.Nothing'),
      get: () => errorWith('Unable to get from a Maybe.Nothing'),
      merge: () => errorWith('Unable to merge from a Maybe.Nothing'),
      toValidation: () => Failure(['Value is null or undefined']),
      getOrElse: defaultValue => defaultValue,
      getOrElseThrow: error => {
        throw error
      },
      orElseThrow: error => {
        throw error
      }
    },
    Maybe
  ))

const errorWith = str => {
  // This will become more concise with throw expressions (https://github.com/tc39/proposal-throw-expressions)
  throw new TypeError(str)
}

Maybe.fromNullable = a => (a != null ? Just(a) : Nothing())
Maybe.fromEmpty = a =>
  Maybe.fromNullable(a).map(x => (x.length === 0 ? null : x))
Maybe.fromValidation = Va => () => {
  if (Va['@@type'] === 'Validation') {
    if (Va.isSuccess()) {
      return Just(Va.merge())
    }
    return Nothing()
  }
  return Maybe.fromNullable(Va)
}

module.exports = Maybe
