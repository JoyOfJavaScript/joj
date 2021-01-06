import Functor from '@joj/blockchain/util/fp/data/contract/Functor.js'
import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.js'


const { assert } = chai

const unique = letters => Array.from(new Set(letters)) //#A
const join = arr => arr.join('')
const toUpper = str => str.toUpperCase()
const identity = x => x

const square = x => Id.of(x).map(a => a ** 2)
const times3 = x => Id.of(x).map(a => a * 3)

class Id {
  #val //#A
  constructor(value) {
    this.#val = value
  }

  static of(value) {
    return new Id(value)
  }

  get() {
    //#B
    return this.#val
  }

  equals(otherValidation) {
    //#C
    return this.#val === otherValidation.value
  }
}

describe('5.4 - Universal protocols', () => {
  it('5.4.1 - Functors: identity and composition', () => {
    assert.deepEqual(['aa', 'bb', 'cc'].map(identity), ['aa', 'bb', 'cc'])
    assert.deepEqual(
      ['aa', 'bb', 'cc'].map(
        compose(
          toUpper,
          join,
          unique
        )
      ),
      ['A', 'B', 'C']
    )
    assert.deepEqual(
      ['aa', 'bb', 'cc']
        .map(unique)
        .map(join)
        .map(toUpper),
      ['A', 'B', 'C']
    )
  })
  it('Functor mixin', () => {
    Object.assign(Id.prototype, Functor)

    assert.equal(
      Id.of('aabbcc')
        .map(unique) // Id(['a', 'b', 'c'])  //#A
        .map(join) // Id(['abc'])
        .map(toUpper) // Id('ABC')
        .get(),
      'ABC'
    )
  })
  it('Monads: Left identity, Right identity, Associativity', () => {
    // Left identity M.of(a).flatMap(f)  ==  f(a)
    const f = x => [x ** 2]
    assert.deepEqual(Array.of(2).flatMap(f), [4])
    assert.deepEqual(f(2), [4])

    // Right identity   m.flatMap(M.of))  ==   m
    assert.deepEqual(Array.of(2).flatMap(x => Array.of(x)), [2])
    assert.deepEqual(Array.of(2), [2])

    // Associativity  m.flatMap(f).flatMap(g) ==== m.flatMap(a => f(a).flatMap(g))
    const g = x => [x * 3]
    assert.deepEqual(
      Array.of(2)
        .flatMap(f)
        .flatMap(g),
      [12]
    )
    assert.deepEqual(Array.of(2).flatMap(a => f(a).flatMap(g)), [12])
  })

  it('Monad mixin', () => {

    const FullMonad = Object.assign({}, Functor, {
      flatMap(f) {
        return this.map(f).get()
      },
      chain(f) {
        //#B
        return this.flatMap(f)
      },
      bind(f) {
        //#B
        return this.flatMap(f)
      }
    });

    Object.assign(Id.prototype, FullMonad);

    assert.equal(
      Id.of(2)
        .flatMap(square)
        .flatMap(times3)
        .get(),
      12
    )

    assert.equal(
      Id.of(2)
        .flatMap(a => square(a).flatMap(times3))
        .get(),
      12
    )
  })

  it('Id class with Functor mixin using bind operator', () => {
    const { map } = Functor;

    // Using bind operator
    assert.equal((new Id('HELLO')):: map(v => v.toLowerCase()).get(), 'hello');
  })
})
