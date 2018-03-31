import Money from '../data/Money'

const processTransaction = (blockchain, transaction) => {
  const txData = [
    transaction.sender,
    transaction.recipient,
    transaction.funds,
  ].join('')

  if (!transaction.verifySignature()) {
    throw new Error('Transaction signature failed to verify')
  }
  // Collect unspent pending transactions from the blockchain
  const utxo = []
  for (const input of transaction.inputs) {
    utxo.push(blockchain.pendingTransactions(input.transactionOutputId))
  }

  // generate transaction outputs
  const leftOver = Money.subtract(
    getInputsValue(transaction),
    transaction.funds
  )
}

const getInputsValue = transaction => {
  let total = 0
  for (const input of transaction.inputs) {
    if (!input.utxo) continue //if Transaction can't be found skip it
    total += input.utxo.value
  }
  return total // TODO: needs to return money
}

/**
 * Exported TransactionLogic interface
 */
const TransactionLogic = {
  processTransaction,
}

export default TransactionLogic
