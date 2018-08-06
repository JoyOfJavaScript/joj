import Maybe from '@joj/adt/maybe'
import SecureHandler from '../common/SecureHandler'

export const Signature = ({ signer, state, keys }) => ({
  get signature () {
    return state.signature
  },
  set signature (s) {
    state.signature = s
  },
  generateSignature (privateKeyPath) {
    return signInput(
      signer,
      privateKeyPath,
      keys.map(k => state[k]).filter(prop => !!prop).join('')
    )
  },
  verifySignature () {
    return signatureVerifier(
      signer,
      state.sender || state.recipient,
      keys.map(k => state[k]).filter(prop => !!prop).join(''),
      state.signature
    )
  }
})

/**
 * Signs the input data given a private key
 *
 * @param {CryptoSigner} signer Signer to use
 * @param {string} privateKey   Private key used to sign
 * @param {string} input        Input data to sign
 * @return {string} Signed data
 * @throws {RangeError} In case any of actual arguments is invalid
 */
const signInput = (signer, privateKey, input) =>
  Maybe.of(k => i => k)
    .ap(Maybe.fromNullable(privateKey))
    .ap(Maybe.fromNullable(input))
    .map(String)
    .map(key => ({ key }))
    .map(signer.sign(input))
    .getOrElseThrow(
      new RangeError(
        'Please provide valid arguments for [privateKey] and [input]'
      )
    )

const verifySignatureInput = (signer, publicKey, data, signature) =>
  Maybe.of(k => s => d => [k, s, d])
    .ap(Maybe.fromNullable(publicKey).map(String))
    .ap(Maybe.fromNullable(signature))
    .ap(Maybe.fromNullable(data))
    .map(fields => signer.verify(...fields))
    .getOrElseThrow(
      new RangeError(
        `Please provide valid arguments for publicKey: [${publicKey}], data: [${data}], and signature: [${signature}]`
      )
    )

const signatureVerifier = !process.env.SECURE
  ? new Proxy(
      verifySignatureInput,
      SecureHandler(process.env.SECURE_ATTEMPTS || 3)
    )
  : verifySignatureInput

export default Signature
