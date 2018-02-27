import BlockLogic from '../behavior/BlockLogic'

const EPOCH = Date.parse('01 Jan 1970 00:00:00 GMT')

/**
 * Represents a single block in the chain
 *
 * @param {String} timestamp    When the block was created
 * @param {Object} data         Data associated with this block
 * @param {String} previousHash Reference to the previous block in the chain
 * @param {String} nonce        Random number used to be changed for mining purposes before adding to the blockchain
 * @return {Block} Newly created block with its own computed hash
 */
const Block = (timestamp, data, previousHash = '') => {
  const nonce = 0
  const hash = BlockLogic.calculateBlockHash(timestamp, data, previousHash)
  return {
    timestamp,
    data,
    previousHash,
    nonce,
    hash,
    inspect: () =>
      `Block {ts: ${timestamp}, data: ${JSON.stringify(data)},\
       ph: ${previousHash}, h: ${hash}}`
  }
}

/**
 * Create a genesis block. There should only ever be one genesis in a chain
 *
 * @param  {Object} data Misc block data to store
 * @return {Block} New genesis block
 */
Block.genesis = data => Block(EPOCH, data || { data: 'Genesis Block' }, '-1')

export default Block
