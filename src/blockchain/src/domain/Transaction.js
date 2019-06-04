import Validation, { Success } from '../lib/fp/data/validation2'
import HasHash from './shared/HasHash'
import HasSignature from './shared/HasSignature'
import HasValidation from './shared/HasValidation'
import { checkSignature } from './transaction/validations'
import { checkTampering } from './shared/validations'

const VERSION = '1.0'

/**
 * A transaction holds information (keys) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like money) is transfered via transactions.
 */
export default class Transaction {
  timestamp = Date.now()
  nonce = 0
  id
  hash

  constructor(sender, recipient, funds, description = 'Generic') {
    this.sender = sender
    this.recipient = recipient
    this.funds = funds
    this.description = description
    this.id = this.hash = this.calculateHash()
  }

  /**
   * Gets the numerical amount of the funds
   * @return {Number} Amount number
   */
  amount() {
    return this.funds.amount
  }

  /**
   * Gets the currency
   * @return {String} Currency string
   */
  currency() {
    return this.funds.currency
  }

  /**
   * Displays a friendly description of this transaction for reporting purposes
   * @return {String} A friendly string representation
   */
  displayTransaction() {
    return `Transaction ${this.description} from ${this.sender} to ${
      this.recipient
    } for ${this.funds.toString()}`
  }

  isValid() {
    return Validation.of(this)
      .flatMap(checkSignature)
      .flatMap(checkTampering)
      .flatMap(() => Success.of(true))
  }
  /**
   * Returns a minimal JSON represetation of this object
   * @return {Object} JSON object
   */
  toJSON() {
    return {
      from: this.sender,
      to: this.recipient,
      id: this.id
    }
  }

  get [Symbol.for('version')]() {
    return VERSION
  }

  [Symbol.iterator]() {
    return {
      next: () => ({ done: true })
    }
  }
}

Object.assign(
  Transaction.prototype,
  HasHash(['timestamp', 'sender', 'recipient', 'funds']),
  HasSignature(['sender', 'recipient', 'funds']),
  HasValidation()
)

// https://medium.com/programmers-blockchain/creating-your-first-blockchain-with-java-part-2-transactions-2cdac335e0ce
// https://nodejs.org/api/crypto.html#crypto_class_sign
