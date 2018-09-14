import crypto from 'crypto'

const DEFAULT_ALGO_SHA256 = 'SHA256' // hashcash-SHA256^2 (bitcoin)
const DEFAULT_ENCODING_HEX = 'hex'

const CryptoHasher = (
  options = { algorithm: DEFAULT_ALGO_SHA256, encoding: DEFAULT_ENCODING_HEX }
) => ({
  /**
     * Create a SHA256 digest from a given data string
     *
     * @param {String} data  Data to use as seed for the hash
     * @return {String} String digest hash
     */
  digest: data =>
    crypto.createHash(options.algorithm).update(data).digest(options.encoding)
})

export default CryptoHasher
