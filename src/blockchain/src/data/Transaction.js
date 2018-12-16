import CryptoSigner from './CryptoSigner'
import HasHash from './HasHash'
import HasSignature from './HasSignature'
import HasValidation from './HasValidation'
import { Failure, Success } from '../../../adt/dist/validation'

/**
 * A transaction holds information (keys) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like money) is transfered via transactions.
 *
 * @param {Key}   sender        Origin of transaction (public key of sender)
 * @param {Key}   recipient     Destination of transaction (public of the receiver)
 * @param {Money} funds         Amount to transfer
 * @param {String} description  Description of the transaction
 * @param {CryptoSigner} signer Signer to use for transactions
 * @return {Transaction} Newly created transaction
 */
const Transaction = (
  sender,
  recipient,
  funds,
  description = 'Generic',
  signer = CryptoSigner()
) => {
  const props = {
    state: {
      sender,
      recipient,
      description,
      funds,
      nonce: 0,
      timestamp: Date.now(),
      [Symbol.for('version')]: '1.0'
    },
    methods: {
      /**
       * Gets the numerical amount of the funds
       * @return {Number} Amount number
       */
      amount () {
        return funds.amount
      },
      /**
       * Gets the currency
       * @return {String} Currency string
       */
      currency () {
        return funds.currency
      },
      /**
       * Displays a friendly description of this transaction for reporting purposes
       * @return {{String}} A friendly string representation
       */
      displayTransaction () {
        return `Transaction ${description} from ${sender} to ${recipient} for ${this.money().toString()}`
      },
      isValid () {
        const isDataValid = this.hash !== undefined
        const isSignatureValid = this.verifySignature()
        if (isDataValid && isSignatureValid) {
          return Success(true)
        } else {
          return isDataValid
            ? Failure([`Failed transaction signature check: ${this.hash}`])
            : Failure([`Invalid transaction: ${this.sender}`])
        }
      },
      /**
       * Returns a minimal JSON represetation of this object
       * @return {Object} JSON object
       */
      toJSON () {
        return {
          from: this.sender,
          to: this.recipient,
          hash: this.hash.valueOf()
        }
      }
    },
    interop: {
      // Empty iterator
      [Symbol.iterator]: () => ({
        next: () => ({ done: true })
      })
    }
  }
  return Object.assign(
    { ...props.state, ...props.methods, ...props.interop },
    HasHash(['sender', 'recipient', 'funds', 'nonce']),
    HasSignature({
      signer,
      keys: ['sender', 'recipient', 'funds']
    }),
    HasValidation()
  )
}
export default Transaction

// https://medium.com/programmers-blockchain/creating-your-first-blockchain-with-java-part-2-transactions-2cdac335e0ce
// https://nodejs.org/api/crypto.html#crypto_class_sign
