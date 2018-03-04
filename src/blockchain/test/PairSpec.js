import assert from 'assert'
import Pair from '../src/behavior/util/Pair'

describe('Pair ADT Value Object', () => {
  it('Should split a pair', () => {
    const p = Pair(String, String)('Luis', 'Atencio')
    assert.equal(p.left, 'Luis')
    assert.equal(p.right, 'Atencio')
    const [l, r] = p
    console.log(p)
    //assert.ok(p instanceof Pair.TYPE)
  })
})
