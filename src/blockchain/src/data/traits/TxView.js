/**
 * Provides an inspect method (mainly for debugging purposes) containing the state of the pending
 * transactions
 *
 * @param {Object} state State object of block
 * @return {string} Returns a string that reflects the state of the block
 */
export const TxView = state => ({
  inspect: () => {
    const { timestamp, pendingTransactions, previousHash, hash, nonce } = state
    return `TxBlock { ts: ${timestamp},\
                      ptx: ${JSON.stringify(pendingTransactions)},\
                      ph: ${previousHash}, h: ${hash}}, n: ${nonce} }`
  }
})

export default TxView
