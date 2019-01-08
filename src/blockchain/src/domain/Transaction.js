import { Failure, Success } from '../../../adt/dist/validation'
import HasHash from './shared/HasHash'
import HasSignature from './shared/HasSignature'
import HasValidation from './shared/HasValidation'
import { curry } from '../../../adt/dist/combinators'

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
export default curry((sender, recipient, funds, description) =>
  Object.assign(
    new class Transaction {
      constructor () {
        this.sender = sender
        this.recipient = recipient
        this.description = description || 'Generic'
        this.funds = funds
        this.nonce = 0
        this.timestamp = Date.now()
        this.id = undefined // Gets computed  later
      }
      /**
       * Gets the numerical amount of the funds
       * @return {Number} Amount number
       */
      amount () {
        return funds.amount
      }

      /**
       * Gets the currency
       * @return {String} Currency string
       */
      currency () {
        return funds.currency
      }

      /**
       * Displays a friendly description of this transaction for reporting purposes
       * @return {{String}} A friendly string representation
       */
      displayTransaction () {
        return `Transaction ${description} from ${sender} to ${recipient} for ${this.funds.toString()}`
      }

      isValid () {
        const isDataValid = this.id !== undefined
        const isSignatureValid = this.verifySignature()
        if (isDataValid && isSignatureValid) {
          return Success(true)
        } else {
          return isDataValid
            ? Failure([
              `Failed transaction signature check for transaction: ${
                this.id
              }`
            ])
            : Failure([`Invalid transaction: ${this.sender}`])
        }
      }
      /**
       * Returns a minimal JSON represetation of this object
       * @return {Object} JSON object
       */
      toJSON () {
        return {
          from: this.sender,
          to: this.recipient,
          id: this.id
        }
      }

      get [Symbol.for('version')] () {
        return '1.0'
      }
      [Symbol.iterator] () {
        return {
          next: () => ({ done: true })
        }
      }
    }(),
    HasHash(['timestamp', 'sender', 'recipient', 'funds', 'nonce']),
    HasSignature(['sender', 'recipient', 'funds']),
    HasValidation()
  )
)

// https://medium.com/programmers-blockchain/creating-your-first-blockchain-with-java-part-2-transactions-2cdac335e0ce
// https://nodejs.org/api/crypto.html#crypto_class_sign
