import { assert } from 'chai'
import Transaction from '../src/data/Transaction'
import Money from '../src/data/Money'

describe('Transaction', () => {
  it('Should create a valid transaction', () => {
    const tx = Transaction('sally', 'luke', Money('₿', 0.1))
    console.log('Transaction Hash: ', tx.hash)
    assert.isNotEmpty(tx.hash)
  })
})
