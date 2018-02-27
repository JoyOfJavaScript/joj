import crypto from 'crypto'
import { curry, compose } from 'ramda'
import { isEmpty } from '../common/helpers'

const EPOCH = Date.parse('01 Jan 1970 00:00:00 GMT')
const ALGO_SHA256 = 'sha256'
const ENCODING_UTF8 = 'hex'

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
    this.hash = calculateHash(this)
    this.nonce = 0
    return this
  },
  inspect() {
    return `Block ${JSON.stringify(this)}`
  }
}

/**
 * Format the provided data pieces and joins them together
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 */
const formatData = (...pieces) => pieces.map(JSON.stringify).join('')

/**
 * Create a SHA256 digest from a given data string
 *
 * @param {String} algorithm Algorithm to use (e.g. sha256)
 * @param {String} data      Data to use as seed for the hash
 */
const createDigest = curry((algorithm, encoding, data) =>
  crypto
    .createHash(algorithm)
    .update(data)
    .digest(encoding)
)

/**
 * Calculates a hash from given block data pieces
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 */
const calculateHash = compose(
  createDigest(ALGO_SHA256, ENCODING_UTF8),
  formatData
)

/**
 * Static version of calculate hash
 *
 * @param  {String} Block Block data to calculate hash from
 * @return {String} New hash
 */
Block.calculateHash = ({ timestamp, data, previousHash, nonce }) =>
  calculateHash(timestamp, data, previousHash || '', nonce || 0)

/**
 * Create a genesis block. There should only ever be one genesis in a chain
 *
 * @param  {Object} data Misc block data to store
 * @return {Block} New genesis block
 */
Block.genesis = data =>
  Object.create(Block).init(EPOCH, data || { data: 'Genesis Block' }, '-1')

export default Block
