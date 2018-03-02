import Blockchain from './Blockchain'
import PendingTransaction from '../behavior/traits/PendingTransaction'

/**
 * Untamperable transactional block chain. Inherits all of the properties of the
 * base Blockchain type. It adds more state to contain pending transactions
 *
 * @param {Array} chain Chain to initialize blockchain with
 * @return {Blockchain} Returns a blockchain object
 */
const TransactionalBlockchain = chain => {
  // Public space
  const state = {
    pendingTransactions: []
  }

  const parent = Blockchain(chain)
  return Object.assign(state, parent, PendingTransaction(state))
}

export default TransactionalBlockchain
