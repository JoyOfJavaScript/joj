import assert from 'assert'
import '../src/common/helpers'

describe('Helper functions', () => {
  it('Should split the data following two conditions', () => {
    const data = [
      { fromAddress: 'address1', toAddress: 'address2', amount: 100 },
      { fromAddress: 'address2', toAddress: 'address1', amount: 50 },
      { fromAddress: 'address1', toAddress: 'address2', amount: 200 }
    ]
    const result = data
      .split(
        tx => tx.fromAddress === 'address1',
        tx => tx.toAddress === 'address1'
      )
      .flatBiMap(tx => -tx.amount, tx => tx.amount)

    assert.deepEqual([-100, -200, 50], result)
  })
})
