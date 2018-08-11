import HashValue from './HashValue'
import LoggerHandler from '../common/LoggerHandler'
import { compose } from '@joj/adt/combinators'

/**
 * Hashes constitute the digital fingerprint of a block
 * They are calcualted using all of the properties of such block
 * Blocks are immutable with respect to their hash, if the hash of a block
 * changes, it's a different block
 *
 * @param {CryptoHasher} hasher Hasher used to generate hashes
 * @param {Object} state  Entire state object of the block
 * @param {Array}  keys   List of attribute names used for hashing
 * @return {string} Return a string hash of the block
 */
const Hash = ({ hasher, state, keys }) => ({
  /**
   * Calculates a hashed value from the values of provided state marked by keys
   * @return {HashValue} A wrapped hash value
   */
  calculateHash () {
    return HashValue(computeCipher(hasher)(keys.map(k => state[k])))
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
 * Calculates a hash from given block data pieces
 *
 * @param {CryptoHasher} hasher Hasher to use
 * @param {Array} pieces Pieces of data to join together into a single string
 * @return {String} Computed cipher
 */
const computeCipher = hasher => compose(hasher.digest, formatData)

Hash.calculateHash = (state, fields) => computeCipher(fields.map(k => state[k]))
Hash.init = (...args) =>
  (process.env.LOG
    ? new Proxy(Hash(...args), LoggerHandler('hash'))
    : Hash(...args))

export default Hash
