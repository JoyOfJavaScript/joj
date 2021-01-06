import Validation, { Failure, Success } from '~util/fp/data/validation2/validation.js'
import HasHash from './shared/HasHash.js'
import HasSignature from './shared/HasSignature.js'
import HasValidation from './shared/HasValidation.js'
import { checkSignature } from './transaction/validations.js'
import { checkTampering } from './shared/validations.js'
import { toJson } from '~util/helpers.js'

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
    this.signature = undefined
    this.id = this.hash = /*#__PURE__*/this.calculateHash()
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
   * Sign this transaction 
   * @param string privateKey 
   */
  signTransaction(privateKey) {
    this.signature = this.sign(privateKey)
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
    return Validation.of(Object.freeze(this))
      .flatMap(/*#__PURE__*/checkSignature)
      .flatMap(/*#__PURE__*/checkTampering)
  }

  // isValid() {
  //   if (!this.verifySignature(this.sender || this.recipient)) {
  //     return Failure.of(`Failed transaction signature check for transaction: ${this.id}`)
  //   }

  //   if (this.hash !== this.calculateHash()) {
  //     return Failure.of('Invalid hash')
  //   }

  //   return Success.of(this)
  // }

  /**
   * Returns a minimal JSON represetation of this object
   * @return {Object} JSON object
   */
  [Symbol.for('toJSON')]() {
    return JSON.stringify({
      from: this.sender,
      to: this.recipient,
      id: this.id,
      funds: toJson(this.funds),
      description: this.description,
      version: VERSION
    }
    )
  }

  get [Symbol.for('version')]() {
    return VERSION
  }

  [Symbol.iterator]() {
    return {
      next: () => ({ done: true })
    }
  }

  get [Symbol.toStringTag]() {
    return 'Transaction'
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
