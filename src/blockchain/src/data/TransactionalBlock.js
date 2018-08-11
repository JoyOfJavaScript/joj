import BlockHeader from './BlockHeader'
import CryptoHasher from './CryptoHasher'
import Genesis from './Genesis'
import Hash from './Hash'
import PendingTransactions from './PendingTransactions'

/**
 * Transactional blocks contain the set of all pending transactions in the chain
 * These are used to move/transfer assets around within transactions
 * Bitcoins are a good example of transactional blocks
 *
 * @param {Array}  pendingTransactions Array of pending transactions from the chain
 * @param {string} previousHash        Reference to the previous block in the chain
 * @param {CryptoHasher} hasher Hasher to use to hash transactional blocks
 * @return {TransactionalBlock} Newly created block with its own computed hash
 * @augments Block
 */
const TransactionalBlock = (
  pendingTransactions = [],
  previousHash = '',
  hasher = CryptoHasher()
) => {
  const state = {
    pendingTransactions
  }
  return Object.assign(
    state,
    BlockHeader(previousHash),
    Hash({ hasher, state, keys: ['timestamp', 'previousHash', 'nonce'] }),
    PendingTransactions(state),
    Genesis(state)
  )
}
export default TransactionalBlock
