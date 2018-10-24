/**
 * Transactional blocks can store the pending transactions of the blockchain they
 * are part of. In reality, blocks would not store all transactions, this is just a
 * contrived example. This behavior may be applied to either a block or a blockchain
 *
 * @return {Object} An object containing methods to manage the state of pending transactions
 */
const HasPendingTransactions = () => ({
  addPendingTransaction (tx) {
    this.pendingTransactions.push(tx)
  },
  pendingTransactionsToString () {
    return this.pendingTransactions.map(JSON.stringify).join(' ')
  },
  countPendingTransactions () {
    return this.pendingTransactions.length
  }
})

export default HasPendingTransactions
