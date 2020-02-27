import { Failure, Success } from '~util/fp/data/validation2/validation.js'

export const checkSignature = tx =>
  tx.verifySignature(tx.sender || tx.recipient)
    ? Success.of(tx)
    : Failure.of(`Failed transaction signature check for transaction: ${tx.id}`)
