import BlockHeader from './BlockHeader'
import Hash from '../behavior/traits/Hash'
import View from '../behavior/traits/View'
import Genesis from '../behavior/traits/Genesis'

/**
 * Represents a single block in the chain. By default, the block
 * is a mutable structure. It's up to the blockchain to decide
 * otherwise.
 *
 * @param {Object} data         Data associated with this block
 * @param {string} previousHash Reference to the previous block in the chain
 * @return {Block} Newly created block with its own computed hash
 * @augments BlockHeader
 */
const DataBlock = (data = {}, previousHash = '') => {
  // Public interface
  const state = {
    constructor: DataBlock,
    // Used for instanceof checks
    [Symbol.hasInstance]: i => i.constructor.name === 'DataBlock',
    data
  }
  const instance = Object.assign(
    state,
    BlockHeader(previousHash),
    Hash(state, ['timestamp', 'data', 'previousHash', 'nonce']),
    View(state),
    Genesis(state)
  )
  // Initialize the data block object with a precomputed hash
  instance.calculateHash()
  return instance
}

/**
 * Create a genesis block. There should only ever be one genesis in a chain
 *
 * @param  {Object} data Misc block data to store
 * @return {Block} New genesis block
 */
DataBlock.genesis = data => DataBlock(data || { data: 'Genesis Block' }, '-1')
DataBlock.calculateHash = (
  block,
  fields = ['timestamp', 'data', 'previousHash', 'nonce']
) => Hash.calculateHash(block, fields)
export default DataBlock
