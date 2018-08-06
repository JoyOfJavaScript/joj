import CryptoSigner from './CryptoSigner'
import Hash from './Hash'
import Signature from './Signature'

/**
 * A transaction holds information (keys) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like money) is transfered via transactions.
 *
 * @param {Key} sender       Origin of transaction (public key of sender)
 * @param {Key} recipient    Destination of transaction (public of the receiver)
 * @param {Money}  funds        Amount to transfer
 * @param {CryptoSigner} signer Signer to use for transactions
 * @return {Transaction} Newly created transaction
 */
const Transaction = (sender, recipient, funds, signer = CryptoSigner()) => {
  const state = {
    sender,
    recipient,
    funds,
    nonce: 0
  }

  return Object.assign(
    state,
    Hash(state, ['sender', 'recipient', 'funds', 'nonce']),
    Signature({
      signer,
      state,
      keys: ['sender', 'recipient', 'funds']
    })
  )
}
export default Transaction

// https://medium.com/programmers-blockchain/creating-your-first-blockchain-with-java-part-2-transactions-2cdac335e0ce
// https://nodejs.org/api/crypto.html#crypto_class_sign
