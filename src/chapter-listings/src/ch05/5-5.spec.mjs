import chai from 'chai'

const { assert } = chai

describe('5.5 - Kinds of algebraic data types', () => {
  it('Records', () => {
    const Pair = (left, right) => ({
      left,
      right,
      toString: () => `Pair [${left}, ${right}]`
    })
    const name = Pair('Luis', 'Atencio')
    assert.equal(name.left, 'Luis')
    assert.equal(name.right, 'Atencio')
  })
})
