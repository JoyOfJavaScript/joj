import assert from 'assert'
import BlockChainLogic from '../src/behavior/BlockChainLogic'
import BlockLogic from '../src/behavior/BlockLogic'
import Money from '../src/data/Money'
import TransactionalBlockchain from '../src/data/TransactionalBlockchain'
import Transaction from '../src/data/Transaction'

describe('Compute the balance in a transactional blockchain', () => {
  it('Should create a blockchain and compute its balance', () => {
    const coinTransactions = TransactionalBlockchain()
    coinTransactions.addPendingTransaction(
      Transaction('address1', 'address2', 100)
    )
    coinTransactions.addPendingTransaction(
      Transaction('address2', 'address1', 50)
    )

    console.log(coinTransactions.pendingTransactionsToString())

    BlockChainLogic.minePendingTransactions(coinTransactions, 'luis-address')
    let balance = BlockChainLogic.calculateBalanceOfAddress(
      coinTransactions,
      'luis-address'
    )
    assert.equal(balance, 0)

    // Reward is in next block, so mine again
    BlockChainLogic.minePendingTransactions(coinTransactions, 'luis-address')

    balance = BlockChainLogic.calculateBalanceOfAddress(
      coinTransactions,
      'luis-address'
    )
    assert.equal(balance, 100)
  })
})
