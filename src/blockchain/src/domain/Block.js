import Validation, { Success } from '~util/fp/data/validation2/validation.js'
import { checkDifficulty, checkIndex, checkLinkage } from './block/validations.js'
import {
  checkLength,
  checkTampering,
  checkTimestamps,
  checkVersion
} from './shared/validations.js'
import HasHash from './shared/HasHash.js'
import HasValidation from './shared/HasValidation.js'
import { composeM } from '~util/fp/combinators.js'
import { toJson } from '~util/helpers.js'

const VERSION = '1.0'

/**
 * Blocks store a certain data (as array) in the chain.
 */
export default class Block {
  #blockchain
  index = 0
  constructor(index = throw new TypeError("index argument required"), previousHash = throw new TypeError("previousHash argument required"), data = [], difficulty = 0) {
  this.index = index
  this.previousHash = previousHash
  this.data = data
  this.nonce = 0
  this.difficulty = difficulty
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
            /*#__PURE__*/ checkTampering,
            /*#__PURE__*/ checkDifficulty,
            /*#__PURE__*/ checkLinkage(previousBlockHash),
            /*#__PURE__*/ checkLength(64),
            /*#__PURE__*/ checkTimestamps(previousBlockTimestamp),
            /*#__PURE__*/ checkVersion(this.#blockchain[Symbol.for('version')]),
            /*#__PURE__*/ checkIndex(previousBlockIndex),
        Validation.of
      )(block)
    })(this)
}

/**
 * Returns the minimal JSON representation of this object
 * @return {Object} JSON object
 */
[Symbol.for('toJSON')]() {
  return JSON.stringify({
    index: this.index,
    previousHash: this.previousHash,
    hash: this.hash,
    timestamp: this.timestamp,
    difficulty: this.difficulty,
    dataCount: this.data.length,
    data: this.data.map(toJson),
    version: VERSION
  }
  )
}

get[Symbol.for('version')]() {
  return VERSION
}

// TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
[Symbol.iterator]() {
  return this.data[Symbol.iterator]()
}

get[Symbol.toStringTag]() {
  return 'Block'
}
}

Object.assign(
  Block.prototype,
  HasHash(['index', 'timestamp', 'previousHash', 'nonce', 'data']),
  HasValidation()
)
