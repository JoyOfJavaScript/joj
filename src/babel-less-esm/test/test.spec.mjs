import assert from 'assert'
import Calculator from '../src/calculator.mjs'

describe('Test', () => {
  it('Import an .mjs module', () => {
    assert.equal(Calculator.multiply(2, 5), 10)
  })
})
