import Hash from '../behavior/traits/Hash'
import View from '../behavior/traits/View'

const EPOCH = Date.parse('01 Jan 1970 00:00:00 GMT')

/**
 * Represents a single block in the chain. By default, the block
 * is a mutable structure. It's up to the blockchain to decide
 * otherwise.
 *
 * @param {String} timestamp    When the block was created
 * @param {Object} data         Data associated with this block
 * @param {String} previousHash Reference to the previous block in the chain
 * @return {Block} Newly created block with its own computed hash
 */
const Block = (timestamp, data, previousHash = '') => {
  const state = {
    timestamp,
    data,
    previousHash,
    hash: '',
    nonce: 0
  }
  const instance = Object.assign(state, Hash(state), View(state))
  instance.calculateHash()
  return instance
}

/**
 * Create a genesis block. There should only ever be one genesis in a chain
 *
 * @param  {Object} data Misc block data to store
 * @return {Block} New genesis block
 */
Block.genesis = data => Block(EPOCH, data || { data: 'Genesis Block' }, '-1')
Block.calculateHash = block => Hash.calculateHash(block)
export default Block
