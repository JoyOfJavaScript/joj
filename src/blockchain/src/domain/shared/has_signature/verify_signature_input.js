import Maybe from '~util/fp/data/maybe.js'

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
export default verifySignatureInput
