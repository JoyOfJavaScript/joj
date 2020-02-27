import Pair from './index.js'
import chai from 'chai'

const { assert } = chai

describe('Pair', () => {
  it('Should destructure a pair of strings  ', () => {
    const p = Pair(String, String)('Luis', 'Atencio')
    assert.equal(p.left, 'Luis')
    assert.equal(p.right, 'Atencio')
    const [l, r] = p
    assert.equal(p.left, l)
    assert.equal(p.right, r)
  })
})
