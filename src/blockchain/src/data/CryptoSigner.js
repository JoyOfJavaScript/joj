import crypto from 'crypto'
import { curry } from '@joj/adt/combinators'

const DEFAULT_ENCODING_HEX = 'hex'
const DEAFAILT_SIGN_ALGO = 'RSA-SHA256'

const CryptoSigner = (
  options = {
    algorithm: DEAFAILT_SIGN_ALGO,
    encoding: DEFAULT_ENCODING_HEX
  }
) => ({
  sign: curry((input, credentials) => {
    const sign = crypto.createSign(options.algorithm)
    sign.update(input)
    return sign.sign(credentials, options.encoding)
  }),
  verify: curry((pem, sign, input) => {
    const verify = crypto.createVerify(options.algorithm)
    verify.update(input)
    return verify.verify(pem, sign, options.encoding)
  })
})

export default CryptoSigner
