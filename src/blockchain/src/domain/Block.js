import '../lang/object'
import Validation, { Success } from '../lib/fp/data/validation2'
import { checkDifficulty, checkIndex, checkLinkage } from './block/validations'
import { checkLength, checkTampering, checkTimestamps, checkVersion } from './shared/validations'
import HasHash from './shared/HasHash'
import HasValidation from './shared/HasValidation'
import { composeM } from '../lib/fp/combinators'

/**
 * Transactional blocks contain the set of all pending transactions in the chain
 * These are used to move/transfer assets around within transactions
 * Bitcoins are a good example of transactional blocks.
 *
 * Hashes constitute the digital fingerprint of a block. They are calcualted using all of the
 * properties of such block. Blocks are immutable with respect to their hash, if the hash of a block
 * changes, it's a different block
 */

const VERSION = '1.0'

export default class Block {
  #blockchain
  index = 0
  constructor(index, previousHash, pendingTransactions = []) {
    this.index = index
    this.previousHash = previousHash
    this.pendingTransactions = pendingTransactions
    this.difficulty = 2
    this.nonce = 0
    this.timestamp = Date.now()
    this.hash = this.calculateHash()
  }

  /**
   * Set the blockchain object this block is contained in
   *
   * @readonly
   * @param {Blockchain} b Blockchain strucure
   * @return {Block} Returns the block
   */
  set blockchain(b) {
    this.#blockchain = b
    return this
  }

  /**
   * Check whether this block is a genesis block (first block in a any chain)
   * @return {Boolean} Whether this is a genesis block
   */
  isGenesis() {
    return this.previousHash === '0'.repeat(64)
  }

  isValid() {
    // return this.isGenesis()
    //   ? Success.of(true)
    //   : Validation.of(this)
    //       .flatMap(checkLength(64))
    //       .flatMap(checkTampering)
    //       .flatMap(checkDifficulty)
    //       .flatMap(checkLinkage(previousHash))
    //       .flatMap(checkTimestamps(previousTimestamp))

    return this.isGenesis()
      ? Success.of(true)
      : (block => {
          // Compare each block with its previous
          const {
            index: previousBlockIndex,
            hash: previousBlockHash,
            timestamp: previousBlockTimestamp
          } = this.#blockchain.lookUp(this.previousHash)

          return composeM(
            () => Success.of(true),
            checkTampering,
            checkDifficulty,
            checkLinkage(previousBlockHash),
            checkLength(64),
            checkTimestamps(previousBlockTimestamp),
            checkVersion(this.#blockchain[Symbol.for('version')]),
            checkIndex(previousBlockIndex),
            Validation.of
          )(block)
        })(this)
  }

  /**
   * Returns the minimal JSON representation of this object
   * @return {Object} JSON object
   */
  toJSON() {
    return {
      index: this.index,
      previousHash: this.previousHash,
      hash: this.hash,
      nonce: this.nonce,
      timestamp: this.timestamp,
      pendingTransactions: this.pendingTransactions.length,
      version: VERSION
    }
  }

  get [Symbol.for('version')]() {
    return VERSION
  }

  // TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
  [Symbol.iterator]() {
    return this.pendingTransactions[Symbol.iterator]()
  }
}

Object.assign(
  Block.prototype,
  HasHash(['index', 'timestamp', 'previousHash', 'nonce', 'pendingTransactions']),
  HasValidation()
)
