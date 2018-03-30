import assert from 'assert'
import BlockchainLogic from '../src/behavior/BlockchainLogic'
import Money from '../src/data/Money'
import TransactionalBlockchain from '../src/data/TransactionalBlockchain'
import Transaction from '../src/data/Transaction'

describe('Compute the balance in a transactional blockchain', () => {
  it('Should create a blockchain and compute its balance', () => {
    const coinTransactions = TransactionalBlockchain()
    coinTransactions.addPendingTransaction(
      Transaction('address1', 'address2', Money('₿', 200))
    )
    coinTransactions.addPendingTransaction(
      Transaction('address2', 'address1', Money('₿', 50))
    )

    BlockchainLogic.minePendingTransactions(coinTransactions, 'luis-address')
    let balance = BlockchainLogic.calculateBalanceOfAddress(
      coinTransactions,
      'luis-address'
    )
    assert.equal(balance.amount, Money.zero().amount)

    // Reward is in next block, so mine again
    BlockchainLogic.minePendingTransactions(coinTransactions, 'luis-address')

    balance = BlockchainLogic.calculateBalanceOfAddress(
      coinTransactions,
      'luis-address'
    )
    console.log('balance is', balance)
    assert.equal(balance.amount, Money('₿', 100).amount)
  })
})
