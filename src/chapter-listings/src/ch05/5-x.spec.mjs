import { Failure, Success } from '@joj/blockchain/lib/fp/data/validation2/validation.mjs'
import { Functor, Monad } from '@joj/blockchain/lib/fp/data/contract.mjs'
import { compose, curry } from '@joj/blockchain/lib/fp/combinators.mjs'
import R from 'ramda'
import chai from 'chai'
const { chain: flatMap, map } = R
const { assert } = chai

describe('5 - Scratch Pad', () => {
  it('Scratch Pad', () => {
    const result = Array.of('aabbcc')
      .map(letters => [...new Set([...letters])])
      .map(uniqueLetters => uniqueLetters.join(''))
      .map(final => final.toUpperCase())
      .pop()
    assert.equal(result, 'ABC')

    const result2 = ['aabbcc']
      .map(letters => [...new Set([...letters])])
      .map(uniqueLetters => uniqueLetters.join(''))
      .map(final => final.toUpperCase())
      .pop()
    assert.equal(result2, 'ABC')

    const result3 = ['aabbcc']
      .map(letters => Array.from(new Set([...letters])))
      .map(uniqueLetters => uniqueLetters.join(''))
      .map(final => final.toUpperCase())[0]
    assert.equal(result3, 'ABC')

    class Id extends Array {
      constructor(value) {
        super(1)
        this.fill(value)
      }
      // static of (value) {
      //   return new this(value)
      // }
      static get [Symbol.species]() {
        return this
      }
    }

    const result4 = Id.of('aabbcc')
      .map(letters => Array.from(new Set([...letters])))
      .map(uniqueLetters => uniqueLetters.join(''))
      .map(final => final.toUpperCase())
      .pop()
    assert.equal(result4, 'ABC')

    const result5 = Id.of('aabbcc')
      .map(letters => Array.from(new Set([...letters])))
      .map(uniqueLetters => uniqueLetters.join(''))
      .flatMap(final => Id.of(final.toUpperCase()))
      .pop()
    assert.equal(result5, 'ABC')

    const uniqueUpperCaseOf = compose(
      final => Id.of(final.toUpperCase()),
      uniqueLetters => uniqueLetters.join(''),
      letters => Array.from(new Set([...letters]))
    )
    assert.equal(uniqueUpperCaseOf('aabbcc'), 'ABC')

    Function.prototype.map = function(f) {
      return compose(
        f,
        this
      )
    }

    const unique = letters => Array.from(new Set([...letters]))
    const join = arr => arr.join('')
    const toUpper = str => str.toUpperCase()
    const uniqueUpperCaseOf2 = unique.map(join).map(toUpper)
    assert.equal(
      uniqueUpperCaseOf2('aabbcc'),
      compose(
        toUpper,
        join,
        unique
      )('aabbcc')
    )

    Function.prototype.flatMap = function(F) {
      return compose(
        arr => arr.pop(),
        F,
        this
      )
    }
    const uniqueUpperCaseOf3 = toUpper.flatMap(unique)
    assert.deepEqual(
      uniqueUpperCaseOf3('A'),
      compose(
        toUpper,
        join,
        unique
      )('aa')
    )

    class Id2 {
      #val
      constructor(value) {
        this.#val = value
      }

      static of(value) {
        return new Id2(value)
      }

      equals(otherValidation) {
        return this.#val === otherValidation.value
      }

      get() {
        return this.#val
      }

      toString() {
        return `${this.constructor.name} (${this.#val})`
      }
    }

    const id2 = Id2.of('hello')
    assert.equal(id2.get(), 'hello')

    Object.assign(Id2.prototype, Functor(), Monad())

    const arr = [['The'], ['Joy'], 'of', ['JavaScript']]
    assert.deepEqual(arr.flat(), ['The', 'Joy', 'of', 'JavaScript'])

    const arr2 = [undefined, ['Joy'], 'of', ['JavaScript']]
    assert.deepEqual(arr2.flat(), [undefined, 'Joy', 'of', 'JavaScript'])

    const arr3 = [['aa'], ['bb'], ['cc']].flat().map(toUpper)
    assert.deepEqual(arr3, ['AA', 'BB', 'CC'])

    const arr4 = ['THE', 'JOY', 'OF', 'JAVASCRIPT'].map(unique)
    assert.deepEqual(arr4, [
      ['T', 'H', 'E'],
      ['J', 'O', 'Y'],
      ['O', 'F'],
      ['J', 'A', 'V', 'S', 'C', 'R', 'I', 'P', 'T']
    ])

    const arr5 = ['JAVASCRIPT'].flatMap(unique)
    assert.deepEqual(arr5, ['J', 'A', 'V', 'S', 'C', 'R', 'I', 'P', 'T'])

    const arr6 = ['aa', 'bb', 'cc'].map(unique).flat()
    assert.deepEqual(arr6, ['a', 'b', 'c'])

    assert.deepEqual([['aa'], ['bb'], ['cc']].flat(), ['aa', 'bb', 'cc'])

    const arr7 = ['aa', 'bb', 'cc'].flatMap(unique)
    assert.deepEqual(arr7, ['a', 'b', 'c'])

    const arr8 = ['aa', 'bb', 'cc'].map(
      compose(
        toUpper,
        join,
        unique
      )
    )
    assert.deepEqual(arr8, ['A', 'B', 'C'])

    const arr9 = ['aa', 'bb', 'cc']
      .map(unique)
      .map(join)
      .map(toUpper)
    assert.deepEqual(arr9, ['A', 'B', 'C'])

    const result6 = Id2.of('aabbcc')
      .map(letters => Array.from(new Set([...letters])))
      .map(uniqueLetters => uniqueLetters.join(''))
      .map(final => final.toUpperCase())
      .get()
    assert.equal(result6, 'ABC')

    console.log([2].flatMap(Array.of))
    console.log(Array.of(2).flatMap(x => Array.of(x)))
    assert.deepEqual(Array.of(2).flatMap(x => [x ** 2]), [4])
    assert.deepEqual(Array.of(2).flatMap(x => Array.of(x)), Array.of(2))
    const m = Array.of(2)
    const f = x => [x ** 2]
    const g = x => [x * 3]
    console.log(m.flatMap(f).flatMap(g))
    assert.deepEqual(m.flatMap(f).flatMap(g), m.flatMap(a => f(a).flatMap(g)))

    const result7 = Id2.of('aabbcc')
      .map(letters => Array.from(new Set([...letters])))
      .map(uniqueLetters => uniqueLetters.join(''))
      .map(final => final.toUpperCase())
      .get()
    assert.equal(result7, 'ABC')

    const square = x => Id2.of(x).map(a => a ** 2)
    const times3 = x => Id2.of(x).map(a => a * 3)

    assert.equal(
      Id2.of(2)
        .flatMap(square)
        .flatMap(times3)
        .get(),
      12
    )

    assert.equal(
      Id2.of(2)
        .flatMap(a => square(a).flatMap(times3))
        .get(),
      12
    )

    const Pair = (left, right) => ({
      left,
      right,
      toString: () => `Pair [${left}, ${right}]`
    })

    //export const compose2 = (f, g) => (...args) => f(g(...args))
    // Function.prototype.map = function(f) {
    //   return (...args) => f(this(...args))
    // }
    const uniqueUpperCaseOf4 = unique.map(join).map(toUpper)
    assert.equal(
      uniqueUpperCaseOf4('aabbcc'),
      compose(
        toUpper,
        join,
        unique
      )('aabbcc')
    )
    const compose2WithMap = (f, g) => g.map(f)
    const composeWithMap = (...fns) => fns.reduce(compose2WithMap)

    Function.prototype.flatMap = function(F) {
      return compose(
        M => F.call(M, M.get()),
        this
      )
    }

    const compose2WithFlatMap = (f, g) => g.flatMap(f)
    const composeWithFlatMap = (...Ms) => Ms.reduce(compose2WithFlatMap)
    assert.equal(
      composeWithFlatMap(num => Id2.of(num + 2), num => Id2.of(num * 2), Id2.of)(8).get(),
      18
    )
    //TODO: finish this
    const uniqueUpperCaseOf5 = composeWithMap(
      final => final.toUpperCase(),
      uniqueLetters => uniqueLetters.join(''),
      letters => Array.from(new Set([...letters]))
    )
    assert.equal(uniqueUpperCaseOf5('aabbcc'), 'ABC')

    // show recursive sum as compose with multiple sums
    const product = ([head, ...rest]) => (!head ? 1 : head * product(rest))
    assert.equal(product([2, 3]), 6)

    assert.equal([2, 2, 3, 3].reduce((a, b) => a * b), 36)
    const amap = new Map([[0, 'foo'], [1, 'bar']])
    assert.deepEqual([...amap.values()], ['foo', 'bar'])
    assert.deepEqual([...amap.keys()], [0, 1])

    const result8 = compose(
      map(final => final.toUpperCase()),
      map(uniqueLetters => uniqueLetters.join('')),
      map(letters => Array.from(new Set([...letters]))),
      Id2.of
    )
    assert.equal(result8('aabbcc').get(), 'ABC')

    const result9 = compose(
      flatMap(final => Id2.of(final.toUpperCase())),
      flatMap(uniqueLetters => Id2.of(uniqueLetters.join(''))),
      flatMap(letters => Id2.of(Array.from(new Set([...letters])))),
      Id2.of
    )
    assert.equal(result9('aabbcc').get(), 'ABC')

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
    assert.equal(safeDivideBy(2)(16).get(), 8)
    assert.equal(safeDivideBy(2)(0).toString(), 'Failure (Number zero not allowed)')
    assert.equal(safeDivideBy(2)(0).getOrElse(0), 0)
  })
})
