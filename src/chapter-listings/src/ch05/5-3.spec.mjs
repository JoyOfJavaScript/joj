import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.js'

const { assert } = chai

const toUpper = str => str.toUpperCase()
const unique = letters => Array.from(new Set([...letters]))
const join = arr => arr.join('')

describe('5.3 - The map/compose correspondence', () => {
  it('map', () => {
    Function.prototype.map = function (f) {
      return compose(
        f,
        this
      )
    }
    assert.equal(
      compose(
        toUpper,
        join,
        unique
      )('aabbcc'),
      'ABC'
    )
    assert.equal(unique.map(join).map(toUpper)('aabbcc'), 'ABC')
  })
  it('flatMap', () => {
    Function.prototype.flatMap = function (F) {
      return compose(
        arr => arr.pop(), //#A
        F,
        this
      )
    }
    assert.equal(toUpper.flatMap(unique)('aa'), 'A')
  })
  it('flatMap with map', () => {
    Function.prototype.flatMap = function (F) {
      return compose(
        arr => arr.pop(),
        this.map(F)
      )
    }
    assert.equal(toUpper.flatMap(unique)('aa'), 'A')
  })
})
