import crypto from 'crypto'

const EC_CURVE_NAME = 'prime192v1'
const ENCODING_HEX = 'hex'

/**
 * Creates an Elliptic Curve Diffie-Hellman (ECDH) key exchange object
 *
 * @param {Object} state Current state object to augment
 * @return {String} Public key
 */
const KeyPair = state => ({
  generateKeyPair: () => {
    const ecdh = crypto.createECDH(EC_CURVE_NAME)
    state.publicKey = ecdh.generateKeys(ENCODING_HEX)
    state.privateKey = ecdh.computeSecret(
      state.publicKey,
      ENCODING_HEX,
      ENCODING_HEX
    )
    return state.publicKey
  }
})
export default KeyPair
