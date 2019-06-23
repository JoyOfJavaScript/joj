import {
  feePercent as feePercentEsm,
  netTotal as netTotalEsm,
  setFeePercent as setFeePercentEsm
} from './calculator2.js'

import { assert } from 'chai'

describe('6 - Scratch Pad', () => {
  it('CJS case', () => {
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
  it('ESM case', () => {
    assert.equal(feePercentEsm, 0.6)
    assert.equal(netTotalEsm(10), 6)
    assert.throw(
      () => {
        feePercentEsm = 0.7
      },
      Error,
      '"feePercentEsm" is read-only.'
    )

    assert.equal(netTotalEsm(10), 6)
    setFeePercentEsm(0.7)
    assert.equal(netTotalEsm(10), 7)
    assert.equal(feePercentEsm, 0.7)
  })
})
