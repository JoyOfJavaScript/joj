export const Transaction = state => ({
  get pendingTransactions() {
    return state.pendingTransactions
  },
  addPendingTransaction(tx) {
    state.pendingTransactions.push(tx)
  }
})

export default Transaction
