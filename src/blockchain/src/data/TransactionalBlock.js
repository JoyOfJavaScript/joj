import BlockHeader from './BlockHeader'
import Genesis from './traits/Genesis'
import Hash from './traits/Hash'
import PendingTransactions from './traits/PendingTransactions'
import TxView from './traits/TxView'
/**
 * Transactional blocks contain the set of all pending transactions in the chain
 * These are used to move/transfer assets around within transactions
 * Bitcoins are a good example of transactional blocks
 *
 * @param {Array}  pendingTransactions Array of pending transactions from the chain
 * @param {string} previousHash        Reference to the previous block in the chain
 * @return {TransactionalBlock} Newly created block with its own computed hash
 * @augments Block
 */
const TransactionalBlock = (pendingTransactions = [], previousHash = '') => {
  // TODO: change order of args
  const state = {
    pendingTransactions
  }
  return Object.assign(
    state,
    BlockHeader(previousHash),
    Hash.init(state, ['timestamp', 'previousHash', 'nonce']),
    PendingTransactions(state),
    TxView(state),
    Genesis(state)
  )
}
export default TransactionalBlock
