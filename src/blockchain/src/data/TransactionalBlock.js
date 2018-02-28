import Block from './Block'
import Transaction from '../behavior/traits/Transaction'

// https://www.youtube.com/watch?v=fRV6cGXVQ4I
const TransactionalBlock = (
  timestamp,
  pendingTransactions = [],
  previousHash = ''
) => {
  const state = {
    pendingTransactions
  }
  const parent = Block(timestamp, {}, previousHash)
  return Object.assign(state, parent, Transaction(state))
}

export default TransactionalBlock
