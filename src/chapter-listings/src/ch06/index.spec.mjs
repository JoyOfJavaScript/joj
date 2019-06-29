import {
  feePercent as feePercentEsm,
  netTotal as netTotalEsm,
  setFeePercent as setFeePercentEsm
} from './calculator2.mjs'
import { createRequire } from 'module'
import chai from 'chai'

const { assert } = chai

describe('6 - Scratch Pad', () => {
  it('CJS case', () => {
    console.log('TBD')
    // const require = createRequire(import.meta.url)
    // // sibling-module.js is a CommonJS module.
    // let { feePercent, netTotal, setFeePercent } = require('./calculator.js')
    // assert.equal(feePercent, 0.6)
    // assert.equal(netTotal(10), 6)
    // feePercent = 0.7
    // assert.equal(feePercent, 0.7)
    // assert.equal(netTotal(10), 6)
    // setFeePercent(0.7)
    // assert.equal(netTotal(10), 7)
    // assert.equal(require('./calculator.js').feePercent, 0.6)
  })
  it('ESM case', () => {
    assert.equal(feePercentEsm, 0.6)
    assert.equal(netTotalEsm(10), 6)
    assert.throws(
      () => {
        feePercentEsm = 0.7
      },
      Error,
      'Assignment to constant variable.'
    )

    assert.equal(netTotalEsm(10), 6)
    setFeePercentEsm(0.7)
    assert.equal(netTotalEsm(10), 7)
    assert.equal(feePercentEsm, 0.7)
  })
})
