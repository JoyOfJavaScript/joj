import Validation, { Failure, Success } from './index.js'
import Maybe from '../maybe.js'
import chai from 'chai'
import { curry } from '../../combinators.js'

const { assert } = chai

const toUpper = str => str.toUpperCase()

const notEmpty = str => (str && str.length > 0 ? Success(str) : Failure(['String is empty']))

const notExceeds = curry((n, str) =>
  str.length <= n ? Success(str) : Failure([`String exceeds set length of ${n}`])
)

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
    assert.deepEqual(v.merge(), ['Expected non-null argument'])
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
