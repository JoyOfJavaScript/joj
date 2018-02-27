import Block from '../data/Block'
import TransactionalBlock from '../data/TransactionalBlock'
import { notEmpty, checkInvariant } from '../common/helpers'
import { curry } from 'ramda'

/**
 * Create a new block
 */
const newBlock = (timestamp, data, previousHash = '') =>
  Object.create(Block).init(
    checkInvariant('timestamp', notEmpty, timestamp),
    data,
    previousHash
  )

const newTxBlock = (timestamp, transactions) =>
  TransactionalBlock(timestamp, transactions)

const mineBlock = (difficulty, block) =>
  compareHashUntil(
    block,
    Array(difficulty)
      .fill(0)
      .join('')
  )

const compareHashUntil = (block, difficulty, nonce = 1) => {
  if (block.hash.startsWith(difficulty)) {
    // Base case reached, return new hash
    console.log(`Block mined: ${block.hash}`)
    return block
  }
  // Continue to compute the hash again with different nonce
  block.nonce = nonce
  block.hash = Block.calculateHash(block)
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
