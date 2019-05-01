import { compose, props } from '../../lib/fp/combinators'
import LoggerHandler from '../../common/LoggerHandler'
import assemble from './has_hash/assemble'
import computeCipher from './has_hash/compute_cipher'

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
 * @return {String} Return a string hash of the block
 */
const HasHash = (
  keys,
  options = { algorithm: DEFAULT_ALGO_SHA256, encoding: DEFAULT_ENCODING_HEX }
) => ({
  /**
   * Calculates a hashed value from the values of provided state marked by keys
   *
   * @return {String} A hash value
   */
  calculateHash() {
    return compose(
      computeCipher(options),
      assemble,
      props(keys)
    )(this)
  }
})

HasHash.init = (...args) =>
  process.env.LOG ? new Proxy(HasHash(...args), LoggerHandler('hash')) : HasHash(...args)

export default HasHash
