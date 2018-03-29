const processTransaction = transaction => {
  const txData = [
    transaction.sender,
    transaction.recipient,
    transaction.funds
  ].join('')

  if (!transaction.verifySignature()) {
  }
}

/**
 * Exported TransactionLogic interface
 */
const TransactionLogic = {
  processTransaction
}

export default TransactionLogic
