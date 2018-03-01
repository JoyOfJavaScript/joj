export const PendingTransaction = state => ({
  get pendingTransactions() {
    return state.pendingTransactions
  },
  addPendingTransaction(tx) {
    state.pendingTransactions.push(tx)
  },
  pendingTransactionsToString() {
    return state.pendingTransactions.map(JSON.stringify).join(' ')
  },
  countPendingTransactions() {
    return state.pendingTransactions.length
  }
})

export default PendingTransaction
