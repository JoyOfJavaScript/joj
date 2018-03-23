import { assert } from 'chai'
import { Validation, Maybe, Combinators } from '../src'

const { Success, Failure } = Validation
const { curry } = Combinators

const toUpper = str => str.toUpperCase()

const notEmpty = str =>
  str && str.length > 0 ? Success(str) : Failure(['String is empty'])

const notExceeds = curry(
  (n, str) =>
    str.length <= n
      ? Success(str)
      : Failure([`String exceeds set length of ${n}`])
)

const startsWithNumber = str =>
  Number.isInteger(str[0])
    ? Success(str)
    : Failure(['Strings does not start with a number'])

describe('From Maybe To Validation', () => {
  it('Maybe -> Validation', () => {
    let v = Maybe.fromNullable('luis')
      .map(toUpper)
      .toValidation()

    assert.isOk(v.isSuccess())
    assert.equal('LUIS', v.merge())

    v = Maybe.fromNullable(null)
      .map(toUpper)
      .toValidation()

    assert.isOk(v.isFailure())
    assert.deepEqual(v.merge(), ['Value is null or undefined'])
  })

  it('Validation -> Maybe', () => {
    let m = Validation.of(x => x)
      .ap(notEmpty('luis'))
      .toMaybe()
      .map(toUpper)

    assert.isOk(m.isJust())
    assert.equal(m.get(), 'LUIS')

    m = Validation.of(x => x)
      .ap(notExceeds(3, 'luis'))
      .toMaybe()
      .map(toUpper)
    assert.isOk(m.isNothing())
    assert.throws(() => m.get(), TypeError)
  })
})
