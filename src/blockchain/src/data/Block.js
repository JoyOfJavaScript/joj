import crypto from 'crypto'
import { curry, compose } from 'ramda'

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
const Block = (timestamp, data = {}, previousHash = '', nonce = 0) => ({
  timestamp,
  data,
  previousHash,
  nonce,
  hash: calculateHash(timestamp, data, previousHash, nonce)
})

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
export const calculateHash = compose(
  createDigest(ALGO_SHA256, ENCODING_UTF8),
  formatData
)

Block.calculateHash = ({ timestamp, data, previousHash, nonce }) =>
  calculateHash(timestamp, data, previousHash || '', nonce || 0)

Block.genesis = data => Block(EPOCH, data || { data: 'Genesis Block' }, '-1')

Block.inspect = block => `Block ${JSON.stringify(block)}`

export default Block
