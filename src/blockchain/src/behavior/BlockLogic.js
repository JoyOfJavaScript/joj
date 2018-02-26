import Block from '../data/Block'

const checkInvariant = name => checker => data => {
  if (!checker(data)) {
    throw new Error(`Invalid argument. Please provide a valid for ${name}`)
  }
  return data
}

// Checks string is not empty
const notEmpty = str => () => str && str.length > 0

/**
 * Create a new block
 */
const newBlock = (timestamp, data, previousHash = '') =>
  Block(checkInvariant('timestamp', notEmpty, timestamp), data, previousHash)

const mineBlock = (difficulty, block) => {
  const difficultyStr = Array(difficulty)
    .fill(0)
    .join('')
  while (!block.hash.startsWith(difficultyStr)) {
    // Using mutable code here for efficiency reasons
    block.nonce++
    block.hash = Block.calculateHash(block)
  }
  console.log(`Block mined: ${block.hash}`)
  return block
}

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  newBlock,
  mineBlock
}

export default BlockLogic
