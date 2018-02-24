import BlockChain from '../data/Blockchain'
import Block from '../data/Block'
import BlockLogic from './BlockLogic'
import Pair from './util/Pair'
import { props, curry, compose } from 'ramda'

const MINING_DIFFICULTY = 2

const append = (a, b) => a + b
const join = separator => array => array.join(separator)

const addBlockTo = curry((blockchain, newBlock) => {
  newBlock = {
    ...newBlock,

    // Override fields in new object
    previousHash: blockchain.last().hash
  }
  // Current hash is based on the previous hash
  newBlock.hash = Block.calculateHash(newBlock)
  return blockchain.push(newBlock)
})

const mineBlockTo = curry((blockchain, newBlock) => {
  newBlock = {
    ...newBlock,

    // Override fields in new object
    previousHash: blockchain.last().hash
  }
  // Mined hash is based on the previous hash
  newBlock = BlockLogic.mineBlock(MINING_DIFFICULTY, newBlock)
  return blockchain.push(newBlock)
})

const isChainValid = blockchain =>
  blockchain
    // Get all blocks
    .blocks()
    // Skip the first one (the array will be off-by-one with respect to the blockchain)
    .slice(1)
    // Convert the resulting array into pairs of blocks Pair(current, previous)
    .map((currentBlock, currentIndex) =>
      Pair(Object, Object)(currentBlock, blockchain.blockAt(currentIndex))
    )
    // Validate every pair of blocks is valid
    .every(pair => {
      const current = pair.left
      const previous = pair.right
      return (
        // 1 .Hashed can't be tampered with
        current.hash === Block.calculateHash(current) &&
        // 2. Blocks form a chain
        current.previousHash === previous.hash
      )
    })

/**
 * Exported BlockChainLogic interface
 */
const BlockChainLogic = {
  addBlockTo,
  mineBlockTo,
  isChainValid
}

export default BlockChainLogic
