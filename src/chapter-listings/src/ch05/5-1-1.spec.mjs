import { compose, curry } from '@joj/blockchain/util/fp/combinators.js'
import chai from 'chai'

const { assert } = chai

const unique = letters => Array.from(new Set(letters)) //#A
const join = arr => arr.join('')
const toUpper = str => str.toUpperCase()

describe('5.1.1 - Using containers for encapsulation and immutability', () => {
  it('Mapping functions on an array', () => {
    const letters = ['aabbcc']
      .map(unique)
      .map(join)
      .map(toUpper)
      .pop()

    assert.equal(letters, 'ABC')

    const letters2 = Array.of('aabbcc')
      .map(unique)
      .map(join)
      .map(toUpper)
      .pop()

    assert.equal(letters2, 'ABC')
  })

  it('Implementing a “contextless” container by extending from Array', () => {
    class Id extends Array {
      constructor(value) {
        super(1) // #A
        this.fill(value)
      }
    }

    const letters = Id.of('aabbcc') //#D
      .map(unique)
      .map(join)
      .map(toUpper)
      .pop()
    assert.equal(letters, 'ABC')
  })
  it('Mapping validate over functions', () => {
    const validate = fn => data =>
      data ? fn(data) : throw new Error(`Received invalid data ${data}`)

    const fns = [toUpper, join, unique].map(validate)

    const letters = compose(...fns)

    assert.equal(letters('aabbcc'), 'ABC')
  })
})
