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
const Block = {
  init: function(timestamp, data, previousHash) {
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.nonce = 0
    this.hash = BlockLogic.calculateBlockHash(this)
    return this
  },
  inspect() {
    return `Block ${JSON.stringify(this, [
      'timestamp',
      'data',
      'previousHash',
      'hash'
    ])}`
  }
}

/**
 * Create a genesis block. There should only ever be one genesis in a chain
 *
 * @param  {Object} data Misc block data to store
 * @return {Block} New genesis block
 */
Block.genesis = data =>
  Object.create(Block).init(EPOCH, data || { data: 'Genesis Block' }, '-1')

export default Block
