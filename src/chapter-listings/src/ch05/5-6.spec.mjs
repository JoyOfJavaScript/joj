import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import HasHash from '@joj/blockchain/domain/shared/HasHash.js'
import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

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
      index: previousBlockIndex, //#A
      timestamp: previousBlockTimestamp
    } = this.#blockchain.lookUp(this.previousHash)

    const validateTimestamps = checkTimestamps(previousBlockTimestamp, this) //#B

    const validateIndex = checkIndex(previousBlockIndex, this) //#B

    const validateTampering = checkTampering(this)

    return validateTimestamps.isSuccess && validateIndex.isSuccess && validateTampering.isSuccess
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

const { assert } = chai

describe('5.6 - Implementing the Validation ADT', () => {
  it('5.6.2 - Modeling success or failure', () => {
    const block = new Block(1, '123456789', ['some data'], 1)
    const checkTampering = block =>
      block.hash === block.calculateHash() ? Success.of(block) : Failure.of('Block hash is invalid')
    assert.isTrue(checkTampering(block).isSuccess)
    block.data = ['data compromised']
    assert.isTrue(checkTampering(block).isFailure)
  })

  it('Parent Validation class with Success and Failure subclasses', () => {
    const read = f =>
      fs.existsSync(f)
        ? Success.of(fs.readFileSync(f)) //#B
        : Failure.of(`File ${f} does not exist!`) //#C
    const file = path.join(process.cwd(), 'src/ch05', 'sample.txt')
    const noFile = path.join(process.cwd(), 'src/ch05', 'not-exists.txt')

    assert.isTrue(read(file).isSuccess)
    assert.isTrue(read(noFile).isFailure)

    const decode = (encoding = 'utf8') => buffer => buffer.toString(encoding)
    const count = arr => (!arr ? 0 : arr.length)

    const countBlocksInFile = f =>
      read(f)
        .map(decode('utf8'))
        .map(JSON.parse)
        .map(count)

    assert.equal(countBlocksInFile(file).get(), 3)
  })

  it('Validating a block', () => {
    const ledger = new Blockchain()
    let block = new Block(ledger.height() + 1, ledger.top.hash, ['some data'])
    block = ledger.push(block)
    console.log(block)
    assert.isTrue(block.isValid())
    block.data = ['data compromised']
    assert.isFalse(block.isValid())
  })

  it('Validation#isFailure', () => {
    const toUpper = word => word.toUpperCase()
    const fromNullable = value => (typeof value === 'undefined' || value === null)
      ? Failure.of('Expected non-null value')
      : Success.of(value);

    assert.equal('Success (J)', fromNullable('j').map(toUpper).toString());
    assert.equal('Failure (Expected non-null value)', fromNullable(null).map(toUpper).toString());
  })
})
