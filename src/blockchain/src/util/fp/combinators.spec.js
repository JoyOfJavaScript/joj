import { Failure, Success } from './data/validation/index.js'
import chai from 'chai'
import { composeM } from './combinators.js'

const { assert } = chai

const notNaN = num =>
  !isNaN(num) ? Success(num) : Failure([`Number (${num}) can't be NaN`])

const isNumber = num =>
  typeof num === 'number'
    ? Success(num)
    : Failure([`Input (${num}) is not a number`])
const inRange = num =>
  num >= 0
    ? Success(num)
    : Failure([`Number (${num}) must be greater or equal to zero`])

const validate = composeM(inRange, isNumber, notNaN)

describe('Combinators', () => {
  it('Test monad composition', () => {
    assert.equal(validate(10).getOrElse(-1), 10)
  })

  it('Test monad composition (rejection)', () => {
    assert.throws(() => {
      const result = validate('-10').getOrElseThrow()
      console.log(result)
    }, Error)
  })

  it('Test monad composition (rejection 2)', () => {
    assert.throws(() => {
      const result = validate(-10).getOrElseThrow()
      console.log(result)
    }, Error)
  })
})
