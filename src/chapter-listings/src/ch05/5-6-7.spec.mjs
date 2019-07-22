import { Failure, Success } from '@joj/blockchain/lib/fp/data/validation2/validation.mjs'
import { compose, curry } from '@joj/blockchain/lib/fp/combinators.mjs'
import R from 'ramda'
import chai from 'chai'
const { chain: flatMap, map } = R

const { assert } = chai

describe('5.6.7 - Third party integration', () => {
  it('Using Ramda', () => {
    const notZero = num => (num !== 0 ? Success.of(num) : Failure.of('Number zero not allowed'))

    const notNaN = num => (!Number.isNaN(num) ? Success.of(num) : Failure.of('NaN'))

    const divideBy = curry((denominator, numerator) => numerator / denominator)

    const safeDivideBy = denominator =>
      compose(
        map(divideBy(denominator)),
        flatMap(notZero),
        flatMap(notNaN),
        Success.of
      )

    const halve = safeDivideBy(2)
    assert.equal(halve(16).get(), 8)
    assert.equal(halve(0).toString(), 'Failure (Number zero not allowed)')
    assert.equal(halve(0).getOrElse(0), 0)
  })
})
