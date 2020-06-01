import '../value/Money.js'
import Transaction from '../Transaction.js'
import balanceOf from './balance_of.js'
import chai from 'chai'

const { assert } = chai

describe('balanceOf Spec', () => {
  it('Should verify the behavior of helper function balanceOf', () => {
    const sender = 'sender123'
    const recipient = 'recipient123'
    const funds = (10).btc()
    const description = 'Test'

    const testTx = new Transaction(sender, recipient, funds, description)
    const result = balanceOf(sender, testTx)
    assert.ok(result.equals((-10).btc()))

    const result2 = balanceOf(recipient, testTx)
    assert.ok(result2.equals((10).btc()))
  })
})
