import Block from '../data/Block'

/**
 * Create a new block
 */
const newBlock = (index, timestamp, data, previousHash = '') =>
  Block(
    checkInvariant('index', checkIndex(index)),
    checkInvariant('timestamp', notEmpty(timestamp)),
    data,
    previousHash
  )

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

// Checks index is greater than Genesis block index
const checkIndex = index => () => index > Block.GENESIS_INDEX

// Checks string is not empty
const notEmpty = str => () => str && str.length > 0

const checkInvariant = name => checker => {
  if (!checker(data)) {
    throw new Error(`Invalid argument. Please provide a valid for ${name}`)
  }
  return data
}

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  newBlock,
  mineBlock
}

export default BlockLogic
