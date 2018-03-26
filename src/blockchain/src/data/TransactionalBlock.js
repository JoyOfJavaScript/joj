import BlockHeader from './BlockHeader'
import PendingTransaction from '../behavior/traits/PendingTransaction'
import TxView from '../behavior/traits/TxView'
import Hash from '../behavior/traits/Hash'
import Genesis from '../behavior/traits/Genesis'

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
    constructor: TransactionalBlock,
    [Symbol.hasInstance]: i => i.constructor.name === 'TransactionalBlock',
    pendingTransactions
  }
  const instance = Object.assign(
    state,
    BlockHeader(previousHash),
    Hash(state, ['timestamp', 'previousHash', 'nonce']),
    PendingTransaction(state),
    TxView(state),
    Genesis(state)
  )
  instance.calculateHash()
  return instance
}
export default TransactionalBlock
