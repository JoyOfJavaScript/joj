import CryptoHasher from './CryptoHasher'
import CryptoSigner from './CryptoSigner'
import HasHash from './HasHash'
import HasSignature from './HasSignature'

/**
 * A transaction holds information (keys) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like money) is transfered via transactions.
 *
 * @param {Key} sender       Origin of transaction (public key of sender)
 * @param {Key} recipient    Destination of transaction (public of the receiver)
 * @param {Funds} funds      Amount to transfer
 * @param {CryptoHasher} hasher Hasher to use for transactions
 * @param {CryptoSigner} signer Signer to use for transactions
 * @return {Transaction} Newly created transaction
 */
const Transaction = (
  sender,
  recipient,
  funds,
  description = 'Generic',
  hasher = CryptoHasher(),
  signer = CryptoSigner()
) => {
  // public space
  const props = {
    sender,
    recipient,
    description,
    amount: funds.amount,
    currency: funds.currency,
    money: funds.toMoney(),
    timestamp: Date.now(),
    [Symbol.for('version')]: '1.0'
  }

  return Object.concat(
    props,
    HasHash({
      hasher,
      keys: ['sender', 'recipient', 'amount', 'currency', 'nonce']
    }),
    HasSignature({
      signer,
      keys: ['sender', 'recipient', 'amount', 'currency']
    })
  )
}
export default Transaction

// https://medium.com/programmers-blockchain/creating-your-first-blockchain-with-java-part-2-transactions-2cdac335e0ce
// https://nodejs.org/api/crypto.html#crypto_class_sign
