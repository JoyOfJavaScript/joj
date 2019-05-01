import { Failure, Success } from '../../lib/fp/data/validation2'

export const checkSignature = tx =>
  tx.verifySignature(tx.sender || tx.recipient)
    ? Success.of(tx)
    : Failure.of(`Failed transaction signature check for transaction: ${tx.id}`)
