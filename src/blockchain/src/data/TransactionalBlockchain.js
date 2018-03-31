import Blockchain from './Blockchain'
import PendingTransaction from '../behavior/traits/PendingTransaction'

/**
 * Untamperable transactional block chain. Inherits all of the properties of the
 * base Blockchain type. It adds more state to contain pending transactions
 *
 * @param  {Array} chain Chain to initialize blockchain with
 * @return {TransactionalBlockchain} Returns a blockchain object
 * @augments {Blockchain}
 */
const TransactionalBlockchain = chain => {
  // Public space
  const state = {
    constructor: TransactionalBlockchain,
    [Symbol.hasInstance]: i => i.constructor.name === 'TransactionalBlockchain',
    pendingTransactions: [],
  }

  return Object.assign(state, Blockchain(chain), PendingTransaction(state))
}

export default TransactionalBlockchain
