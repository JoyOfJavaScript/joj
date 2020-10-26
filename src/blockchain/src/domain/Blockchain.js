/* eslint-disable no-undef */

import Block from './Block.js'
import EventEmitter from 'events'
import HasValidation from './shared/HasValidation.js'
import { Success } from '~util/fp/data/validation2/validation.js'

const VERSION = '1.0'
const EVENT_NAME = 'new_block'
/**
 * Untamperable blockchain. You may initialize the chain with an existing
 * chain. But the most common thing to do is initialize with an empty Chain
 * and allow itself to bootstrap with a Genesis block.
 */
export default class Blockchain {
  blocks = new Map() // Could be made private, but instance method invocation breaks when called through a proxy
  blockPushEmitter = new EventEmitter()

  constructor(genesis = createGenesisBlock()) {
    genesis.blockchain = this
    this.top = genesis
    this.blocks.set(genesis.hash, genesis)
    this.timestamp = Date.now()
    this.pendingTransactions = []
  }

  /**
   * Create a copy of this blockchain
   * @param {Blockchain} blockchain Blockchain instance to copy
   * @return {Blockchain} New Blockchain instance
   */
  static copy(blockchain) {
    return this.from([...blockchain])
  }

  push(newBlock) {
    newBlock.blockchain = this
    this.blocks.set(newBlock.hash, newBlock)
    this.blockPushEmitter.emit(EVENT_NAME, newBlock);
    this.top = newBlock
    return this.top
  }

  height() {
    return this.blocks.size
  }

  lookUpByIndex(index) {
    for (const block of this) {
      if (block.index === index) {
        return block
      }
    }
    return null
  }

  lookUp(hash) {
    const h = hash
    if (this.blocks.has(h)) {
      return this.blocks.get(h)
    }
    throw new Error(`Block with hash ${h} not found!`)
  }

  // unit test helper
  * newBlock() {
    while (true) {
      const block = new Block(this.height(), this.top.hash, this.pendingTransactions)
      yield this.push(block)
    }
  }

  clear() {
    this.blocks.clear()
  }

  /**
   * Validate the container
   *
   * @return {boolean} Whether the chain is valid
   */
  isValid() {
    return Success.of(this.height() > 0)

    // Maybe: add to check all block indeces for uniqueness
  }

  addPendingTransaction(tx) {
    this.pendingTransactions.push(tx)
  }

  addPendingTransactions(...txs) {
    this.pendingTransactions.push(...txs)
  }

  get [Symbol.for('version')]() {
    return VERSION
  }

  [Symbol.iterator]() {
    return this.blocks.values()[Symbol.iterator]()
  }

  async *[Symbol.asyncIterator]() {
    this.unsubscribe()

    for (const block of this.blocks.values()) {
      yield block
    }
    while (true) {
      if (this.blockPushEmitter.listenerCount(EVENT_NAME) === 0) {
        break
      }
      yield new Promise(resolve => {
        this.blockPushEmitter.once(EVENT_NAME, block => {
          console.log('Emitting a new block: ', block.hash)
          resolve(block)
        })
      })
    }
  }

  [Symbol.observable]() {
    return new Observable(observer => {
      for (const block of this) {
        observer.next(block)
      }
      this.blockPushEmitter.on(EVENT_NAME, block => {
        console.log('Emitting a new block: ', block.hash)
        observer.next(block)
      })
    })
  }

  subscribe({ next }) {
    this.blockPushEmitter.on(EVENT_NAME, value => {
      next(value)
    })
  }

  unsubscribe() {
    this.blockPushEmitter.removeAllListeners(EVENT_NAME)
  }

  get [Symbol.toStringTag]() {
    return 'Blockchain'
  }
}

Object.assign(Blockchain.prototype, HasValidation())

function createGenesisBlock() {
  const previousHash = '0'.repeat(64)
  return new Block(1, previousHash, [])
}
