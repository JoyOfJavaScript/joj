import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import { compose, curry } from '@joj/blockchain/util/fp/combinators.js'
import Functor from '@joj/blockchain/util/fp/data/contract/Functor.js'
import Monad from '@joj/blockchain/util/fp/data/contract/Monad.js'
import R from 'ramda'
import chai from 'chai'
const { chain: flatMap, map } = R

const { assert } = chai

const notZero = num => (num !== 0 ? Success.of(num) : Failure.of('Number zero not allowed'))

const notNaN = num => (!Number.isNaN(num) ? Success.of(num) : Failure.of('NaN'))

const divideBy = curry((denominator, numerator) => numerator / denominator)

describe('5.6.7 - Third party integration', () => {
  it('Using Ramda', () => {

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

  it('Using Validation with binding operator', () => {

    const { map: map2 } = Functor;
    const { flatMap: flatMap2 } = Monad;

    assert.equal(map2.call(Success.of(2), x => x * 2).get(), 4);
    assert.equal(map2.call(map2.call(Success.of(2), x => x * 2), x => x ** 2).get(), 16);

    const apply = curry((fn, F) => map2.call(F, fn));
    assert.equal(apply(x => x * 2)(Success.of(2)).get(), 4);
    assert.equal(compose(apply(x => x ** 2), apply(x => x * 2))(Success.of(2)).get(), 16);
    assert.equal(Success.of(2) :: map2(x => x * 2).get(), 4);
    assert.equal(Success.of(2) :: map2(x => x * 2) :: map2(x => x ** 2).get(), 16);

    const safeDivideBy = denominator => numerator => Success.of(numerator) :: flatMap2(notNaN) :: flatMap2(notZero):: map2(divideBy(denominator))
    const halve = safeDivideBy(2)
    assert.equal(halve(16).get(), 8)
  })
})
