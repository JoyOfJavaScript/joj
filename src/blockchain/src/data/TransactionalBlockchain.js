import Blockchain from './Blockchain'

const TransactionalBlockchain = chain => {
  // Delegate base behavior to Blockchain
  const txBlockchain = Object.create(Blockchain(chain))
  txBlockchain.pendingTransactions = []

  return txBlockchain
}

export default TransactionalBlockchain
