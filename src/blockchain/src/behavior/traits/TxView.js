export const TxView = state => ({
  inspect: () => {
    const { timestamp, pendingTransactions, previousHash, hash, nonce } = state
    return `TxBlock { ts: ${timestamp},\
                      tx: ${JSON.stringify(pendingTransactions)},\
                      ph: ${previousHash}, h: ${hash}}, n: ${nonce} }`
  }
})

export default TxView
