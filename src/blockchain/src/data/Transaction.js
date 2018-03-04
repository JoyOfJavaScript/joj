import Hash from '../behavior/traits/Hash'

/**
 * A transaction holds information (keys) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like  money) is transfered via transactions.
 *
 * @param {string} sender      Origin of transaction (public key of sender)
 * @param {string} recipient  Destination of transaction (public of the receiver)
 * @param {Money}  funds        Amount to transfer
 * @return {Transaction} Newly created transaction
 */
const Transaction = (sender, recipient, funds) => {
  const state = {
    constructor: Transaction,
    [Symbol.hasInstance]: i => i.constructor.name === 'Transaction',
    sender,
    recipient,
    funds,
    hash: '',
    nonce: 0
  }
  const instance = Object.assign(
    state,
    Hash(state, ['sender', 'recipient', 'funds', 'nonce'])
  )
  instance.calculateHash()
  return instance
}
export default Transaction
