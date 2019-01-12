import Block from './Block.js'
import HasHash from './shared/HasHash'
import HasSignature from './shared/HasSignature'
import HasValidation from './shared/HasValidation'
import Transaction from './Transaction.js'
import { curry } from 'fp/combinators'

/**
 * Creates a new Block instance
 *
 * @param {Number} id                  Block ID
 * @param {String} previousHash        Reference to the previous block in the chain
 * @param {Array}  pendingTransactions Array of pending transactions from the chain
 * @return {Block} Newly created block with its own computed hash
 */
export const initBlock = (id, previousHash, pendingTransactions) =>
  Object.assign(
    new Block(id, previousHash, pendingTransactions),
    HasHash(['timestamp', 'previousHash', 'nonce', 'pendingTransactions']),
    HasValidation()
  )

/**
 * Creates a new Transaction instance
 *
 * @param {Key}   sender        Origin of transaction (public key of sender)
 * @param {Key}   recipient     Destination of transaction (public of the receiver)
 * @param {Money} funds         Amount to transfer
 * @param {String} description  Description of the transaction
 * @param {CryptoSigner} signer Signer to use for transactions
 * @return {Transaction} Newly created transaction
 */
export const initTransaction = curry((sender, recipient, funds, description) =>
  Object.assign(
    new Transaction(sender, recipient, funds, description),
    HasHash(['timestamp', 'sender', 'recipient', 'funds', 'nonce']),
    HasSignature(['sender', 'recipient', 'funds']),
    HasValidation()
  )
)

export default { initBlock, initTransaction }
