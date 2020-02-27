import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.js'

const { assert } = chai

describe('6.6.2 - Orthogonal Architecture', () => {
  it('takeSorted', () => {
    function takeSorted(n, arr = []) {
      const a = arr.sort()
      return a.slice(0, n)
    }
    assert.deepEqual(takeSorted(2, [9, 5, 2]), [2, 5])
  })
  it('takeSorted (orthogonal)', () => {
    const slice = n => arr => arr.slice(0, n)
    const sort = arr => [...arr].sort()
    const takeSorted = n =>
      compose(
        //#A
        slice(n),
        sort //#B
      )
    const original = [9, 5, 2]
    assert.deepEqual(takeSorted(2)(original), [2, 5])
    assert.deepEqual(original, [9, 5, 2])
  })
})
