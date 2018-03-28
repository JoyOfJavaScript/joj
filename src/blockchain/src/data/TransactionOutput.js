import Hash from '../behavior/traits/Hash'
import { Maybe } from 'joj-adt'

/**
 * Transaction output show the final sent to each party from the
 * parent transaction.
 *
 * @param {string} recipient Recipients address (public key)
 * @param {Money}  funds     Fund to transfer
 * @param {string} parentTransactionId Id (hash) of the parent transaction
 */

const TransactionOutput = (recipient, funds, parentTransactionId) => {
  const state = {
    recipient,
    funds,
    parentTransactionId,
    isMine: publicKey =>
      Maybe.fromNullable(publicKey)
        .map(k => k === recipient)
        .getOrElse(false)
  }
  return Object.assign(
    state,
    Hash(state, ['recipient', 'funds', 'parentTransactionId'])
  )
}

export default TransactionOutput
