import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.mjs'

const { assert } = chai

const unique = letters => Array.from(new Set([...letters])) //#A
const join = arr => arr.join('')
const toUpper = str => str.toUpperCase()

describe('5.1.2 - Contextual composition', () => {
  it('Uses compose in place of Id.map', () => {
    const uniqueUpperCaseOf = compose(
      toUpper,
      join,
      unique
    )

    assert.equal(uniqueUpperCaseOf('aabbcc'), 'ABC')
  })
})
