import assert from 'assert'
import Blockchain from '../src/data/Blockchain'

describe('Helper functions', () => {
  it('Should split the data following two conditions', () => {
    const data = Blockchain.init()
    data.push({ fromAddress: 'address1', toAddress: 'address2', amount: 100 })
    data.push({ fromAddress: 'address2', toAddress: 'address1', amount: 50 })
    data.push({ fromAddress: 'address1', toAddress: 'address2', amount: 200 })

    const result = data
      .split(
        tx => tx.fromAddress === 'address1',
        tx => tx.toAddress === 'address1'
      )
      .bimap(Array, Array)(
        arrA => arrA.map(tx => -tx.amount),
        arrB => arrB.map(tx => tx.amount)
      )
      .toArray()
      .reduce((a, b) => a.concat(b))

    assert.deepEqual([-100, -200, 50], result)
  })
})
