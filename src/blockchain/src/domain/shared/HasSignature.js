import SecureHandler from '../../common/SecureHandler'
import sign from './has_signature/sign'
import signInput from './has_signature/sign_input'
import verify from './has_signature/verify'
import verifySignatureInput from './has_signature/verify_signature_input'

const DEFAULT_ENCODING_HEX = 'hex'
const DEFAULT_SIGN_ALGO = 'RSA-SHA256'

export const HasSignature = (
  keys,
  options = {
    algorithm: DEFAULT_SIGN_ALGO,
    encoding: DEFAULT_ENCODING_HEX
  }
) => ({
  sign(privateKey) {
    return signInput(
      sign(options),
      privateKey,
      keys
        .map(k => this[k])
        .filter(prop => !!prop)
        .join('')
    )
  },
  verifySignature(publicKey, signature) {
    return signatureVerifier(
      verify(options),
      publicKey,
      keys
        .map(k => this[k])
        .filter(prop => !!prop)
        .join(''),
      signature || this.signature // Default to using the object's own signature property (if available)
    )
  }
})

const signatureVerifier = !process.env.SECURE
  ? new Proxy(verifySignatureInput, SecureHandler(process.env.SECURE_ATTEMPTS || 3))
  : verifySignatureInput

export default HasSignature
