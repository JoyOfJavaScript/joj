import { compose, curry } from '../src/util/fp/combinators.js'
import crypto from 'crypto'

const ALGO_SHA256 = 'sha256'
const ENCODING_HEX = 'hex'

function computeCipherUntil(hashPrefix, obj = {}, entropy = 1) {
  try {
    const hash = computeCipher(Object.assign({ entropy }, obj))
    if (hash.startsWith(hashPrefix)) {
      return hash
    }
    return computeCipherUntil(hashPrefix, obj, entropy + 1)
  } catch (e) {
    return null
  }
}

const pad = num => ''.padStart(num, '0')

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
 * Calculates a hash from given object
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 * @return {String} Computed cipher
 */
const computeCipher = compose(
  createDigest(ALGO_SHA256, ENCODING_HEX),
  JSON.stringify
)

// With curry, can't use defautl args
export default curry(async function computeHash(difficulty, obj) {
  // If used with an await expression, it will convered to a resolved Promise automatically
  return Promise.resolve(computeCipherUntil(pad(difficulty || 1), obj || {}))
})
