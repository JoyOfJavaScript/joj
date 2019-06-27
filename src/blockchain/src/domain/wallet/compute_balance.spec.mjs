import '../value/Money.mjs'
import Blockchain from '../Blockchain.mjs'
import Transaction from '../Transaction.mjs'
import chai from 'chai'
import computeBalance from './compute_balance.mjs'

const { assert } = chai

describe('compute_balance Spec', () => {
  it('Should verify the behavior of helper function balanceOf', () => {
    const ledger = new Blockchain()
    const tx1 = new Transaction('sender123', 'recipient123', (10).jsl(), 'Test')
    const tx2 = new Transaction('sender123', 'recipient123', (10).jsl(), 'Test2')
    ledger.addPendingTransactions(tx1, tx2)
    ledger.newBlock()
    assert.ok(computeBalance('sender123')([...ledger]).equals((-20).jsl()))
    assert.ok(computeBalance('recipient123')([...ledger]).equals((20).jsl()))
  })
})
