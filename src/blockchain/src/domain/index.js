import Block from './Block'
import Blockchain from './Blockchain'
import HasHash from './shared/HasHash'
import HasSignature from './shared/HasSignature'
import HasValidation from './shared/HasValidation'
import Transaction from './Transaction'
import Wallet from './Wallet'
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

/**
 * Creates a new Wallet instance
 *
 * @param {Key} publicKey  Public Key (PEM). Also used as wallet's address to send funds to
 * @param {Key} privateKey Private key
 * @return {Wallet} A new wallet
 */
export const initWallet = curry(
  (publicKey, privateKey) => new Wallet(publicKey, privateKey)
)

// Alternate solution: http://2ality.com/2013/03/subclassing-builtins-es6.html

// TODO
// store blockchain to file db

/**
 * Creates a new Blockchain instance
 *
 * @param {Block} genesis Genesis block or first block in the chain
 * @return {Blockchain} Returns a blockchain object
 */
// Talk about species and the species pattern
// http://exploringjs.com/es6/ch_classes.html#sec_species-pattern

export const initBlockchain = (genesis = createGenesisBlock()) => {
  const version = '1.0'
  return Object.assign(new Blockchain(version, genesis), HasValidation())
}

function createGenesisBlock (previousHash = '0'.repeat(64)) {
  const pendingTransactions = [] // Could contain a first transaction like a starting reward
  const genesis = initBlock(1, previousHash, pendingTransactions)
  genesis.hash = genesis.calculateHash()
  return genesis
}

export default { initBlock, initTransaction, initBlockchain }
