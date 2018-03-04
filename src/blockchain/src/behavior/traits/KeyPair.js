import crypto from 'crypto'

const EC_CURVE_NAME = 'prime192v1'
const ENCODING_HEX = 'hex'

/**
 * Creates an Elliptic Curve Diffie-Hellman (ECDH) key exchange object
 *
 * @return {String} Public key
 */
const KeyPair = () => ({
  generateKeyPair: () => {
    return crypto.createECDH(EC_CURVE_NAME).generateKeys(ENCODING_HEX)
  }
})
export default KeyPair
