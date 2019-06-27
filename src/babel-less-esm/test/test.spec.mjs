// import assert from 'assert'
import Calculator from '../src/calculator.mjs'
import Calculator2 from '../src/calculator2.mjs'
import chai from 'chai'

const { assert } = chai

describe('Test', () => {
  it('Import an .mjs module', () => {
    assert.equal(Calculator.multiply(2, 5), 10)
  })
  it('Async call', async () => {
    const result = await Calculator.multiply(2, 5)
    assert.equal(result, 10)
  })
})
