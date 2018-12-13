import { compose, curry } from '../../../adt/dist/combinators'
import LoggerHandler from '../common/LoggerHandler'
import crypto from 'crypto'

const DEFAULT_ALGO_SHA256 = 'SHA256' // hashcash-SHA256^2 (bitcoin)
const DEFAULT_ENCODING_HEX = 'hex'

/**
 * HasHash mixin.
 *
 * A hash algorithm turns an arbitrarily-sized amount of data into a fixed-length hash.
 * The same hash will always result from the same data, but modifying the data by even
 * one bit will completely change the hash. Like all computer data, hashes are large numbers,
 * and are usually written as hexadecimal.
 *
 * @param {Array} keys     List of property names present in this object that shall be used for hashing
 * @param {Object} options Options to configure the hashing process (algorithm, encoding)
 * @return {string} Return a string hash of the block
 */
const HasHash = (
  keys,
  options = { algorithm: DEFAULT_ALGO_SHA256, encoding: DEFAULT_ENCODING_HEX }
) => ({
  /**
   * Calculates a hashed value from the values of provided state marked by keys
   * @param {String} entropy Add more entropy to the calculated hash for this object
   * @return {String} A hash value
   */
  calculateHash (entropy = '') {
    return computeCipher(options)(keys.map(k => this[k]).concat(entropy))
  }
})

const generateDigest = curry((options, data) =>
  crypto
    .createHash(options.algorithm)
    .update(data)
    .digest(options.encoding)
)

/**
 * Format the provided data pieces and joins them together
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 * @return {String} Concatenated string of all provided pieces
 */
const assemble = (...pieces) => pieces.map(JSON.stringify).join('')

/**
 * Calculates a hash from given block data pieces
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 * @return {String} Computed cipher
 */
const computeCipher = options =>
  compose(
    generateDigest(options),
    assemble
  )

HasHash.init = (...args) =>
  process.env.LOG
    ? new Proxy(HasHash(...args), LoggerHandler('hash'))
    : HasHash(...args)

export default HasHash
