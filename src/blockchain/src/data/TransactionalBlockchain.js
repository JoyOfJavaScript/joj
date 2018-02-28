import Blockchain from './Blockchain'
import Transaction from '../behavior/traits/Transaction'

const TransactionalBlockchain = chain => {
  const state = {
    pendingTransactions: []
  }

  const parent = Blockchain(chain)
  return Object.assign(state, parent, Transaction(state))
}

export default TransactionalBlockchain
