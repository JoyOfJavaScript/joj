import { isFunction } from '../combinators'

const Success = a => {
  return {
    isSuccess: () => true,
    isFailure: () => false,
    fold: (fn = x => x) => fn(a),
    foldOrElse: (fn = x => x) => fn(a),
    map: fn => Validation.fromNullable(fn(a)),
    ap: Va =>
      Va.isFailure()
        ? Va
        : a && isFunction(a)
          ? Success(
              isFunction(Va.fold()) ? Va.fold().call(Va, a) : a(Va.fold())
            )
          : a ? Success(Va.fold().call(Va, a)) : Failure(),
    concat: Va => Va,
    bifold: (successTransform, _) => successTransform(a),
    bimap: (successTransform, _) => Success(successTransform(a)),
    merge: () => a
  }
}

const Failure = b => {
  return {
    isSuccess: () => false,
    isFailure: () => true,
    map: _ => Failure(b),
    ap: Va => (Va.isFailure() ? Failure(b.concat(Va.merge())) : Failure(b)),
    foldOrElse: (_, defaultValue) => defaultValue,
    concat: Va => (Va.isFailure() ? Failure(b.concat(Va.fold())) : Failure(b)),
    bifold: (_, failTransform) => failTransform(b),
    bimap: (_, failTransform) => Failure(failTransform(b)),
    fold: _ => errorWith('Unable to fold from a Validate.Failure'),
    merge: () => b
  }
}

const errorWith = str => {
  // This will become more concise with throw expressions (https://github.com/tc39/proposal-throw-expressions)
  throw new TypeError(str)
}

const Validation = {
  '@@type': 'Validation',
  fromNullable: (a, ...errors) => (a != null ? Success(a) : Failure(errors)),
  fromMaybe: (Ma, ...errors) => () => {
    if (Ma['@@type'] === 'Maybe') {
      if (Ma.isJust()) {
        return Success(Ma.fold(a => a))
      }
      return Failure(errors)
    }
    return Validation.fromNullable(Ma)
  },
  Success,
  Failure
}

module.exports = Validation
