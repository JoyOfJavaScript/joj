import '../value/Money'
import Block from '../Block'
import Blockchain from '../Blockchain'
import Transaction from '../Transaction'
import { assert } from 'chai'
import computeBalance from './compute_balance'

describe('balanceOf Spec', () => {
  it('Should verify the behavior of helper function balanceOf', () => {
    const ledger = new Blockchain()
    const tx1 = new Transaction('sender123', 'recipient123', (10).btc(), 'Test')
    const tx2 = new Transaction(
      'sender123',
      'recipient123',
      (10).btc(),
      'Test2'
    )
    const block = new Block(2, ledger.top.hash, [tx1, tx2])
    ledger.push(block)
    console.log('compute_balance', computeBalance('sender123')([...ledger]))
    assert.ok(computeBalance('sender123')([...ledger]).equals((-20).btc()))
    assert.ok(computeBalance('recipient123')([...ledger]).equals((20).btc()))
  })
})
