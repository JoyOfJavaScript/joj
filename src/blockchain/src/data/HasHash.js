import HashValue from './HashValue'
import LoggerHandler from '../common/LoggerHandler'
import { compose } from '../../../adt/dist/combinators'

/**
 * HasHash mixin.
 *
 * A hash algorithm turns an arbitrarily-sized amount of data into a fixed-length hash.
 * The same hash will always result from the same data, but modifying the data by even
 * one bit will completely change the hash. Like all computer data, hashes are large numbers,
 * and are usually written as hexadecimal.
 *
 * @param {CryptoHasher} hasher Hasher used to generate hashes
 * @param {Array}        keys   List of property names present in this object that shall be used for hashing
 * @return {string} Return a string hash of the block
 */
const HasHash = ({ hasher, keys }) => ({
  /**
   * Calculates a hashed value from the values of provided state marked by keys
   * @param {String} entropy Add more entropy to the calculated hash
   * @return {HashValue} A wrapped hash value
   */
  calculateHash (entropy = '') {
    return HashValue(
      computeCipher(hasher)(keys.map(k => this[k]).concat(entropy))
    )
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

HasHash.calculateHash = (state, fields) =>
  computeCipher(fields.map(k => state[k]))
HasHash.init = (...args) =>
  (process.env.LOG
    ? new Proxy(HasHash(...args), LoggerHandler('hash'))
    : HasHash(...args))

export default HasHash