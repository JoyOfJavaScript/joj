import { curry, compose } from 'ramda'
import crypto from 'crypto'

const ALGO_SHA256 = 'sha256' // hashcash-SHA256^2 (bitcoin)
const ENCODING_UTF8 = 'hex'

/**
 * Hashes constitute the digital fingerprint of a block
 * They are calcualted using all of the properties of such block
 * Blocks are immutable with respect to their hash, if the hash of a block
 * changes, it's a different block
 *
 * @param {Object} state Entire state object of the block
 * @return {String} Return a string hash of the block
 */
export const Hash = state => ({
  calculateHash: () => {
    const { timestamp, data, previousHash, nonce } = state
    console.log('[DEBUG] Retrying hash: ', nonce)
    return (state.hash = computeCipher(timestamp, data, previousHash, nonce))
  }
})

/**
 * Format the provided data pieces and joins them together
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 * @return {String} Concatenated string of all provided pieces
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
 * @return {String} Computed cipher
 */
const computeCipher = compose(
  createDigest(ALGO_SHA256, ENCODING_UTF8),
  formatData
)

Hash.calculateHash = ({ timestamp, data, previousHash, nonce }) =>
  computeCipher(timestamp, data, previousHash, nonce)

export default Hash
