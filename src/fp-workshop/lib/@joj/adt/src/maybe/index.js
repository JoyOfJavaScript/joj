import { isFunction, identity } from '../combinators'
import { Success, Failure } from '../validation'

const Maybe = {
  '@@type': 'Maybe',
  of: a => Just(a),
}

export const Just = (Maybe.Just = a =>
  Object.assign(
    {
      [Symbol.toStringTag]: 'Maybe#Just',
      [Symbol.for('validation')]: () => Success(a),
      isJust: () => true,
      isNothing: () => false,
      fold: (fn = identity) => fn(a),
      map: fn => Maybe.fromNullable(fn(a)),
      flatMap: fn => Maybe.fromNullable(fn(a).merge()),
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
      toValidation: () => Success(a),
    },
    Maybe
  ))

export const Nothing = (Maybe.Nothing = b =>
  Object.assign(
    {
      [Symbol.toStringTag]: 'Maybe#Nothing',
      [Symbol.for('validation')]: () => Failure(['Expected non-null argument']),
      isJust: () => false,
      isNothing: () => true,
      map: _ => Nothing(),
      flatMap: fn => Nothing(),
      ap: Ma => Nothing(),
      fold: fn => fn(),
      get: () => errorWith('Unable to get from a Maybe.Nothing'),
      merge: () => errorWith('Unable to merge from a Maybe.Nothing'),
      toValidation: () => Failure(['Expected non-null argument']),
      getOrElse: defaultValue => defaultValue,
      getOrElseThrow: error => {
        throw error
      },
      orElseThrow: error => {
        throw error
      },
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

export default Maybe
module.exports = Maybe
