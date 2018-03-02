import Block from '../data/Block'
import TransactionalBlock from '../data/TransactionalBlock'
import { notEmpty, checkInvariant } from '../common/helpers'

/**
 * Create a new block
 */
const newBlock = (timestamp, data, previousHash) =>
  Block(checkInvariant('timestamp', notEmpty, timestamp), data, previousHash)

const newTxBlock = (timestamp, transactions) =>
  TransactionalBlock(
    checkInvariant('timestamp', notEmpty, timestamp),
    transactions
  )

const mineBlock = (difficulty, block) =>
  compareHashUntil(
    block,
    Array(difficulty)
      .fill(0)
      .join('')
  )

// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const compareHashUntil = (block, difficulty, nonce = 1) => {
  if (block.hash.startsWith(difficulty)) {
    // Base case reached, return new hash
    console.log(`Block mined: ${block.hash}`)
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.calculateHash()
  return compareHashUntil(block, difficulty, nonce + 1)
}

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  newBlock,
  newTxBlock,
  mineBlock
}

export default BlockLogic
