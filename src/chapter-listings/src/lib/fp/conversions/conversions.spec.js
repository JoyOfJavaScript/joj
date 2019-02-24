import { toMaybe, toValidation } from './'
import Maybe from '../data/maybe'
import Validation from '../data/validation'
import { assert } from 'chai'
import { compose } from '../combinators'

const notEmpty = str =>
  str && str.length > 0
    ? Validation.Success(str)
    : Validation.Failure(['String is empty'])

describe('Conversions', () => {
  it('Should convert from Maybe#Just to Validation#Succcess', () => {
    const Va = compose(
      toValidation,
      Maybe.fromNullable
    )
    assert.equal(Va(10).merge(), 10)
    assert.isOk(Va(10).isSuccess())
  })
  it('Should convert from Maybe#Nothing to Validation#Failure', () => {
    const Va = compose(
      toValidation,
      Maybe.fromNullable
    )
    assert.isOk(Va(null).isFailure())
    assert.deepEqual(Va(null).merge(), ['Expected non-null argument'])
  })
  it('Should convert from Validation#Success to Maybe#Just', () => {
    const Ma = compose(
      toMaybe,
      notEmpty
    )
    assert.isOk(Ma('Not Empty').isJust())
    assert.equal(Ma('Not Empty').merge(), 'Not Empty')
  })
  it('Should convert from Validation#Failure to Maybe#Nothing', () => {
    const Ma = compose(
      toMaybe,
      notEmpty
    )
    assert.isOk(Ma('').isNothing())
    assert.throws(() => Ma('').get(), TypeError)
  })
})
