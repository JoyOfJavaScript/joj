import Block from './Block'
import PendingTransaction from '../behavior/traits/PendingTransaction'
import TxView from '../behavior/traits/TxView'
import Hash from '../behavior/traits/Hash'

// https://www.youtube.com/watch?v=fRV6cGXVQ4I
const TransactionalBlock = (
  timestamp,
  pendingTransactions = [],
  previousHash = ''
) => {
  const state = {
    pendingTransactions,
    // Compose parent state
    ...Block(timestamp, {}, previousHash) // Was not able to use Block as part of Object.assign because it would copy the state
  }
  return Object.assign(
    state,
    Hash(state),
    PendingTransaction(state),
    TxView(state)
  )
}
export default TransactionalBlock
