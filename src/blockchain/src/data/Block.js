import Hash from '../behavior/traits/Hash'
import View from '../behavior/traits/View'
import Genesis from '../behavior/traits/Genesis'

/**
 * Represents a single block in the chain. By default, the block
 * is a mutable structure. It's up to the blockchain to decide
 * otherwise.
 *
 * @param {Object} data         Data associated with this block
 * @param {String} previousHash Reference to the previous block in the chain
 * @return {Block} Newly created block with its own computed hash
 */
const Block = (data, previousHash = '') => {
  // Public interface
  const state = {
    data,
    previousHash,
    timestamp: Date.call(null),
    hash: '',
    nonce: 0
  }
  const instance = Object.assign(
    state,
    Hash(state),
    View(state),
    Genesis(state)
  )
  instance.calculateHash()
  return instance
}

/**
 * Create a genesis block. There should only ever be one genesis in a chain
 *
 * @param  {Object} data Misc block data to store
 * @return {Block} New genesis block
 */
Block.genesis = data => Block(data || { data: 'Genesis Block' }, '-1')
Block.calculateHash = block => Hash.calculateHash(block)
export default Block
