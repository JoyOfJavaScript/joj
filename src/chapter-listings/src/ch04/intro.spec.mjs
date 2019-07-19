import chai from 'chai'

const { assert } = chai

describe('4 - Introduction', () => {
  it('Demonstrates that JavaScript functions are objects too by printing its parent constructor', () => {
    assert.equal(Function.prototype.__proto__.constructor, Object)
  })
})
