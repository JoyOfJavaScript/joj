import { compose, curry } from '@joj/blockchain/util/fp/combinators.js'
import chai from 'chai'

const { assert } = chai

const unique = letters => Array.from(new Set([...letters])) //#A
const toUpper = str => str.toUpperCase()

const validate = fn => data => {
  if (data) {
    return fn(data) //#A
  }
  throw new Error(`Received invalid data ${data}`) //#B
}

describe('5 - Intro', () => {
  it('Mapping validation over array of functions', () => {
    const join = arr => arr.join('')

    const fns = [toUpper, join, unique].map(validate)

    const letters = compose(...fns)

    assert.equal(letters('aabbcc'), 'ABC')
  })
  it('Mapping validation over array of functions (failure)', () => {
    const join = arr => null // simulate function failure to validate

    const fns = [toUpper, join, unique].map(validate)

    const letters = compose(...fns)

    assert.throw(
      () => {
        letters('aabbcc')
      },
      Error,
      'eceived invalid data null'
    )
  })
})
