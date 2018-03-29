/**
 * Transactional blocks can store the pending transactions of the blockchain they
 * are part of. In reality, blocks would not store all transactions, this is just a
 * contrived example. This behavior may be applied to either a block or a blockchain
 *
 * @param {Object} state Instance data
 * @return {Object} An object containing methods to manage the state of pending transactions
 */
export const PendingTransaction = state => ({
  get pendingTransactions() {
    return state.pendingTransactions
  },
  addPendingTransaction(tx) {
    state.pendingTransactions.set(tx.hash, tx)
  },
  pendingTransactionsToString() {
    //TODO: map over the map and print key value pairs
    return state.pendingTransactions.map(JSON.stringify).join(' ')
  },
  countPendingTransactions() {
    return state.pendingTransactions.size
  }
})

export default PendingTransaction
