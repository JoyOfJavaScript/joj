import PendingTransaction from '../behavior/traits/PendingTransaction'
import TxView from '../behavior/traits/TxView'
import Hash from '../behavior/traits/Hash'
import Genesis from '../behavior/traits/Genesis'

// https://www.youtube.com/watch?v=fRV6cGXVQ4I
/**
 * Transactional blocks contain the set of all pending transactions in the chain
 * These are used to move/transfer assets around within transactions
 * Bitcoins are a good example of transactional blocks
 */
const TransactionalBlock = (
  timestamp,
  pendingTransactions = [],
  previousHash = ''
) => {
  const state = {
    pendingTransactions,
    timestamp,
    previousHash,
    hash: '',
    nonce: 0
  }
  const instance = Object.assign(
    state,
    Hash(state),
    PendingTransaction(state),
    TxView(state),
    Genesis(state)
  )
  instance.calculateHash()
  return instance
}
export default TransactionalBlock
