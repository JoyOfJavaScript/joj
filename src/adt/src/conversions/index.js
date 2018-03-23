import { Validation, Maybe } from '../'

const { Success, Failure } = Validation
const { Just, Nothing } = Maybe

const maybeToValidation = (Ma, ...errors) =>
  Ma.isJust() ? Success(Ma.get()) : Failure(errors)

const validationToMaybe = Va => (Va.isSuccess() ? Just(Va.merge()) : Nothing())
