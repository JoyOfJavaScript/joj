const chai = require('chai')
const { assert } = chai

describe('6.3 - Static vs Dynamic module system (CommonJS)', () => {
  it('Tests different ways of importing', () => {
    const Transaction = require('./calculator')
    assert.isNotNull(Transaction)

    const { exists, readFileSync } = require('fs')
    assert.isNotNull(exists)
    assert.isNotNull(readFileSync)
    assert.isFunction(exists)
  })
  it('Uses calculator module', () => {
    let { feePercent, netTotal, setFeePercent } = require('./calculator.js')

    assert.equal(feePercent, 0.6)
    assert.equal(netTotal(10), 6)
    feePercent = 0.7
    assert.equal(feePercent, 0.7)
    assert.equal(netTotal(10), 6)
    setFeePercent(0.7)
    assert.equal(netTotal(10), 7)
    assert.equal(require('./calculator.js').feePercent, 0.6)
  })
})
