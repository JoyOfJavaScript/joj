import Maybe from '~util/fp/data/maybe.js'

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
    .getOrElseThrow(new Error('Please provide valid arguments for [privateKey] and [input]'))

export default signInput
