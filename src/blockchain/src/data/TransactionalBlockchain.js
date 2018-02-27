import Blockchain from './Blockchain'

const TransactionalBlockchain = chain => {
  // Delegate base behavior to Blockchain through OLLO
  const txBlockchain = Object.create(Blockchain(chain))
  // Private space
  const _pendingTx = []

  // Public space
  txBlockchain.pendingTransactions = () => [..._pendingTx]

  return txBlockchain
}

export default TransactionalBlockchain
