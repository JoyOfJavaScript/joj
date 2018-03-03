import Block from './Block'
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
 */
const DataBlock = (data, previousHash = '') => {
  // Public interface
  const state = {
    data
  }
  const instance = Object.assign(
    state,
    Block(previousHash),
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
DataBlock.genesis = data => DataBlock(data || { data: 'Genesis Block' }, '-1')
DataBlock.calculateHash = block => Hash.calculateHash(block)
export default DataBlock
