import BlockHeader from './BlockHeader'

// https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch4.md
class TransactionalBlock extends BlockHeader {
  pendingTransactions = []
  constructor (previousHash, pendingTransactions) {
    super(previousHash)
    this.pendingTransactions = pendingTransactions
  }

  get pendingTransactions () {
    return this.pendingTransactions
  }

  addPendingTransaction (tx) {
    this.pendingTransactions.push(tx)
  }

  pendingTransactionsToString () {
    return this.pendingTransactions.map(JSON.stringify).join(' ')
  }

  countPendingTransactions () {
    return this.pendingTransactions.length
  }
}

export default TransactionalBlock
