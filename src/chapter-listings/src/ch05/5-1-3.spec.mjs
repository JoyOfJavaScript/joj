import chai from 'chai'

const { assert } = chai
describe('5.1.3 - JavaScript data types', () => {
  it('Tests JS primitive types', () => {
    assert.isTrue(typeof true === 'boolean')
    assert.isTrue(typeof 42 === 'number')
    assert.isTrue(typeof 'jojs' === 'string')
    assert.isTrue(typeof undefined === 'undefined')
    assert.isTrue(typeof null === 'object')
  })
})
