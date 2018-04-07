import crypto from 'crypto'
import { Maybe } from '@joj/adt'

const ENCODING_HEX = 'hex'
const SIGN_ALGO = 'RSA-SHA256'

export const Signature = (state, keys) => ({
  generateSignature(privateKeyPath) {
    return (state.signature = signInput(
      privateKeyPath,
      keys
        .map(k => state[k])
        .filter(prop => !!prop)
        .join('')
    ))
  },
  verifySignature() {
    return verifySignatureInput(
      state.sender || state.recipient,
      keys
        .map(k => state[k])
        .filter(prop => !!prop)
        .join(''),
      state.signature
    )
  },
})

/**
 * Signs the input data given a private key
 *
 * @param {string} privateKeyPath Private used to sign
 * @param {string} input          Input data to sign
 * @return {string} Signed data
 * @throws {RangeError} In case any of actual arguments is invalid
 */
const signInput = (privateKeyPath, input) =>
  Maybe.of(k => i => k)
    .ap(
      Maybe.fromNullable(privateKeyPath).orElseThrow(
        new Error(`Unable to fetch key from path ${privateKeyPath}`)
      )
    )
    .ap(Maybe.fromNullable(input))
    .map(pem => ({
      key: pem,
    }))
    .map(credentials => {
      const sign = crypto.createSign(SIGN_ALGO)
      sign.update(input)
      return sign.sign(credentials, ENCODING_HEX)
    })
    .getOrElseThrow(
      new RangeError(
        'Please provide valid arguments for [privateKey] and [input]'
      )
    )

const verifySignatureInput = (publicKeyPath, data, signature) =>
  Maybe.of(k => d => s => [k, d, s])
    .ap(Maybe.fromNullable(publicKeyPath))
    .ap(Maybe.fromNullable(data))
    .ap(Maybe.fromNullable(signature))
    .map(([pem, input, sign]) => {
      const verify = crypto.createVerify(SIGN_ALGO)
      verify.update(input)
      return verify.verify(pem, sign, ENCODING_HEX)
    })
    .getOrElseThrow(
      new RangeError(
        `Please provide valid arguments for publicKeyPath: [${publicKeyPath}], data: [${data}], and signature: [${signature}]`
      )
    )

export default Signature
