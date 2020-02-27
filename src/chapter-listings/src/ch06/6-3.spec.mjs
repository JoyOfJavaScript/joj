import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import { exists, readFileSync } from 'fs'
import { feePercent, netTotal, setFeePercent } from './calculator.mjs'
import chai from 'chai'

const { assert } = chai

describe('6.3 - Static vs Dynamic module system', () => {
  it('Tests different ways of importing', () => {
    assert.isNotNull(Failure)
    assert.isNotNull(Success)
    assert.isNotNull(exists)
    assert.isNotNull(readFileSync)
    assert.isFunction(exists)
  })

  it('Uses calculator module', () => {
    assert.equal(feePercent, 0.6)
    assert.equal(netTotal(10), 6)
    assert.throws(
      () => {
        feePercent = 0.7 //#A
      },
      Error,
      'Assignment to constant variable.'
    )
    assert.equal(netTotal(10), 6)
    setFeePercent(0.7) //#B
    assert.equal(netTotal(10), 7)
    assert.equal(feePercent, 0.7)
  })
})
