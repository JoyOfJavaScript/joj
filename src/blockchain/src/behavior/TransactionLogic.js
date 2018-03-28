import crypto from 'crypto'
import fs from 'fs'
import { Maybe } from 'joj-adt'

const ENCODING_HEX = 'hex'
const SIGN_ALGO = 'RSA-SHA256'

const readEncoded = (encoding = 'utf8') => path =>
  fs.readFileSync(path, encoding)

/**
 * Signs the input data given a private key
 * @param {string} privateKeyPath Private used to sign
 * @param {string} passphrase     Passphrase used to generate key pair
 * @param {string} input          Input data to sign
 * @return {string} Signed data
 * @throws {RangeError} In case any of actual arguments is invalid
 */
const signInput = (privateKeyPath, passphrase, input) =>
  Maybe.of(k => p => i => k)
    .ap(
      Maybe.fromNullable(privateKeyPath)
        .map(readEncoded('utf8'))
        .orElseThrow(
          new Error(`Unable to fetch key from path ${privateKeyPath}`)
        )
    )
    .ap(Maybe.fromNullable(passphrase))
    .ap(Maybe.fromNullable(input))
    .map(pem => ({
      key: pem,
      passphrase
    }))
    .map(credentials => {
      const sign = crypto.createSign(SIGN_ALGO)
      sign.update(input)
      return sign.sign(credentials, ENCODING_HEX)
    })
    .getOrElseThrow(
      new RangeError(
        'Please provide valid arguments for [privateKey], [passphrase] and [input]'
      )
    )

const verifySignature = (publicKeyPath, data, signature) =>
  Maybe.of(k => d => s => k)
    .ap(Maybe.fromNullable(publicKeyPath).map(readEncoded('utf8')))
    .ap(Maybe.fromNullable(data))
    .ap(Maybe.fromNullable(signature))
    .map(pem => {
      const verify = crypto.createVerify(SIGN_ALGO)
      verify.update(data)
      return verify.verify(pem, signature, ENCODING_HEX)
    })
    .getOrElseThrow(() => {
      throw new RangeError(
        'Please provide valid arguments for [publicKey] [data] and [signature]'
      )
    })

/**
 * Exported BlockLogic interface
 */
const TransactionLogic = {
  signInput,
  verifySignature
}

export default TransactionLogic
