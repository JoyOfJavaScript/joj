import Block from './Block'

// https://www.youtube.com/watch?v=fRV6cGXVQ4I
const TransactionalBlock = (
  timestamp,
  transactions,
  previousHash = '',
  nonce = 0
) => {
  const txBlock = Object.create(Block(timestamp, null, previousHash, nonce))
  txBlock.transactions = transactions || []
}
export default TransactionalBlock
