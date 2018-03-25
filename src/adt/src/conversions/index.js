import { Success, Failure } from '../validation'
import { Just, Nothing } from '../maybe'

const maybeToValidation = (Ma, ...errors) =>
  Ma.isJust() ? Success(Ma.get()) : Failure(errors)

const validationToMaybe = Va => (Va.isSuccess() ? Just(Va.merge()) : Nothing())

module.exports = {
  maybeToValidation,
  validationToMaybe
}
