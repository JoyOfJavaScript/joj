import Blockchain from './Blockchain'
import PendingTransaction from '../behavior/traits/PendingTransaction'

const TransactionalBlockchain = chain => {
  const state = {
    pendingTransactions: []
  }

  const parent = Blockchain(chain)
  return Object.assign(state, parent, PendingTransaction(state))
}

export default TransactionalBlockchain
