
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import Functor from '@joj/blockchain/util/fp/data/contract/Functor.js'
import HasHash from '@joj/blockchain/domain/shared/HasHash.js'
import Monad from '@joj/blockchain/util/fp/data/contract/Monad.js'
import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'

const VERSION = '1.0'

const checkTimestamps = curry((previousBlockTimestamp, block) =>
  block.timestamp >= previousBlockTimestamp
    ? Success.of(block)
    : Failure.of(`Block timestamps out of order`)
)

const checkIndex = curry((previousBlockIndex, block) =>
  previousBlockIndex < block.index ? Success.of(block) : Failure.of(`Block out of order`)
)

const checkTampering = block =>
  block.hash === block.calculateHash() ? Success.of(block) : Failure.of('Block hash is invalid')

class Block {
  #blockchain
  index = 0
  constructor(index, previousHash, data = [], difficulty = 0) {
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
    const {
      index: previousBlockIndex,
      timestamp: previousBlockTimestamp
    } = this.#blockchain.lookUp(this.previousHash)

    return Validation.of(this)
      .flatMap(checkTimestamps(previousBlockTimestamp)) //#A
      .flatMap(checkIndex(previousBlockIndex)) //#A
      .flatMap(checkTampering) //#A
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
      dataCount: this.data.length,
      version: VERSION
    }
  }

  get [Symbol.for('version')]() {
    return VERSION
  }

  // TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
  [Symbol.iterator]() {
    return this.data[Symbol.iterator]()
  }
}

Object.assign(Block.prototype, HasHash(['index', 'timestamp', 'previousHash', 'nonce', 'data']))

class Validation {
  #val //#A
  constructor(value) {
    this.#val = value
    if (![Success.name, Failure.name].includes(new.target.name)) {
      //#B
      throw new Error(
        `Can't directly constructor a Validation. 
            Please use constructor Validation.of`
      )
    }
  }

  get() {
    //#C
    return this.#val
  }

  static of(value) {
    //#D
    return Validation.Success(value)
  }

  static Success(a) {
    return Success.of(a)
  }

  static Failure(error) {
    return Failure.of(error)
  }

  get isSuccess() {
    //#E
    return false
  }

  get isFailure() {
    //#E
    return false
  }

  equals(otherValidation) {
    //#F
    return this.#val === otherValidation.get()
  }

  getOrElse(defaultVal) {
    //#G
    return this.#val || defaultVal
  }

  toString() {
    return `${this.constructor.name} (${this.#val
  })`
  }
}

class Success extends Validation {
  static of(a) {
    return new Success(a)
  }

  get isSuccess() {
    return true //#A
  }
}

class Failure extends Validation {
  get isFailure() {
    //#A
    return true
  }

  static of(b) {
    return new Failure(b)
  }

  get() {
    //#B
    throw new Error(`Can't extract the value of a Failure`)
  }

getOrElse(defaultVal) {
  //#C
  return defaultVal
}
}

Object.assign(Success.prototype, Functor, Monad)

const NoopFunctor = {
  map() {
    return this;
  }
}

const NoopMonad = {
  flatMap(f) {
    return this;
  },
  chain(f) {
    //#B
    return this.flatMap(f);
  },
  bind(f) {
    //#B
    return this.flatMap(f);
  }
}

Object.assign(Failure.prototype, NoopFunctor, NoopMonad)

const { assert } = chai

describe('5.6.4 - Higher-kinded composition with Validation', () => {
  it('Shows isValid using flatMap', () => {
    const ledger = new Blockchain()
    let block = new Block(ledger.height() + 1, ledger.top.hash, ['some data'])
    block = ledger.push(block)
    console.log(block)
    assert.isTrue(block.isValid().isSuccess)
    block.data = ['data compromised']
    assert.isTrue(block.isValid().isFailure)
    assert.equal('Failure (Block hash is invalid)', block.isValid().toString());
  })
  it('Shows error handling', () => {

    const toUpper = word => word.toUpperCase()
    const fromNullable = value => (typeof value === 'undefined' || value === null)
      ? Failure.of('Expected non-null value')
      : Success.of(value);

    const MyLogger = {
      defaultLogger: :: console.log
    };

    assert.equal('Success (JOJ)', fromNullable('joj').map(toUpper).toString());
    assert.equal('Failure (Expected non-null value)', fromNullable(null).map(toUpper).toString());


  })
})
