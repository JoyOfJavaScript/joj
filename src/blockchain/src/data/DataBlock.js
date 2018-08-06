import BlockHeader from './BlockHeader'
import CryptoHasher from './CryptoHasher'
import Genesis from './Genesis'
import Hash from './Hash'

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
const DataBlock = (data = {}, previousHash = '', hasher = CryptoHasher()) => {
  // Public interface
  const state = {
    constructor: DataBlock,
    // Used for instanceof checks
    [Symbol.hasInstance]: i => i.constructor.name === 'DataBlock',
    data,
    inspect: () => {
      const { timestamp, hash } = state
      return `DataBlock {ts: ${timestamp}, data: ${JSON.stringify(data)},\
         ph: ${previousHash}, h: ${hash}}`
    }
  }
  return Object.assign(
    // analyze why rest param does't work
    state,
    BlockHeader(previousHash),
    Hash({
      hasher,
      state,
      keys: ['timestamp', 'data', 'previousHash', 'nonce']
    }),
    Genesis(state)
  )
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
