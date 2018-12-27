import Maybe from '../../../../adt/dist/maybe'
import SecureHandler from '../../common/SecureHandler'
import sign from './has_signature/sign'
import verify from './has_signature/verify'

const DEFAULT_ENCODING_HEX = 'hex'
const DEFAULT_SIGN_ALGO = 'RSA-SHA256'

export const HasSignature = (
  keys,
  options = {
    algorithm: DEFAULT_SIGN_ALGO,
    encoding: DEFAULT_ENCODING_HEX
  }
) => ({
  generateSignature (privateKeyPath) {
    return signInput(
      sign(options),
      privateKeyPath,
      keys
        .map(k => this[k])
        .filter(prop => !!prop)
        .join('')
    )
  },
  verifySignature () {
    return signatureVerifier(
      verify(options),
      this.sender || this.recipient,
      keys
        .map(k => this[k])
        .filter(prop => !!prop)
        .join(''),
      this.signature
    )
  }
})

/**
 * Signs the input data given a private key
 *
 * @param {Function} signer     Function used to sign
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
    .map(signer(input))
    .getOrElseThrow(
      new Error('Please provide valid arguments for [privateKey] and [input]')
    )

const verifySignatureInput = (verifier, publicKey, data, signature) =>
  Maybe.of(k => s => d => [k, s, d])
    .ap(Maybe.fromNullable(publicKey).map(String))
    .ap(Maybe.fromNullable(signature))
    .ap(Maybe.fromNullable(data))
    .map(fields => verifier(...fields))
    .getOrElseThrow(
      new Error(
        `Please provide valid arguments for publicKey: [${publicKey}], data: [${data}], and signature: [${signature}]`
      )
    )

const signatureVerifier = !process.env.SECURE
  ? new Proxy(
    verifySignatureInput,
    SecureHandler(process.env.SECURE_ATTEMPTS || 3)
  )
  : verifySignatureInput

export default HasSignature
