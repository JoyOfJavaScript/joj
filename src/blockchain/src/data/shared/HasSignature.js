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

const signatureVerifier = !process.env.SECURE
  ? new Proxy(
    verifySignatureInput,
    SecureHandler(process.env.SECURE_ATTEMPTS || 3)
  )
  : verifySignatureInput

export default HasSignature
