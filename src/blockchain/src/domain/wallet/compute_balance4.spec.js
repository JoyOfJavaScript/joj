import '../value/Money'
import Blockchain from '../Blockchain'
import Transaction from '../Transaction'
import { assert } from 'chai'
import computeBalance from './compute_balance4'

describe('compute_balance4 Spec', () => {
  it('Should verify the behavior of helper function balanceOf', () => {
    const ledger = new Blockchain()
    const tx1 = new Transaction('sender123', 'recipient123', (10).btc(), 'Test')
    const tx2 = new Transaction(
      'sender123',
      'recipient123',
      (10).btc(),
      'Test2'
    )
    ledger.addPendingTransactions(tx1, tx2)
    ledger.newBlock()
    assert.ok(computeBalance('sender123')([...ledger]).equals((-20).btc()))
    assert.ok(computeBalance('recipient123', [...ledger]).equals((20).btc()))
  })
})
