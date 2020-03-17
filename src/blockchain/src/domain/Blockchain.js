import Block from './Block.js'
import EventEmmitter from 'events'
import HasValidation from './shared/HasValidation.js'
import { Success } from '~util/fp/data/validation2/validation.js'

const VERSION = '1.0'

/**
 * Untamperable blockchain. You may initialize the chain with an existing
 * chain. But the most common thing to do is initialize with an empty Chain
 * and allow itself to bootstrap with a Genesis block.
 */
export default class Blockchain {
  blocks = new Map() // Could be made private, but instance method invocation breaks when called through a proxy
  blockPushEmitter = new EventEmmitter()
  constructor(genesis = createGenesisBlock()) {
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

  /**
   * Helper function to construct a blockchain data structure from a set of blocks
   * @return {Blockchain} A new Blockchain instace from a set of blocks
   */
  static from(...blocks) {
    const newChain = new Blockchain()
    for (const block of blocks) {
      newChain.push(block)
    }
    return newChain
  }

  push(newBlock) {
    newBlock.blockchain = this
    this.blocks.set(newBlock.hash, newBlock)
    this.top = newBlock
    this.blockPushEmitter.emit('new_block', newBlock);
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
  newBlock() {
    const block = new Block(this.height(), this.top.hash, [...this.pendingTransactions])
    block.blockchain = this
    this.pendingTransactions = []
    return this.push(block)
  }

  /**
   * Validate the container
   *
   * @return {boolean} Whether the chain is valid
   */
  // TODO: Use an iterator to check all blocks instead of toArray. Delete toArray method and use ...blockchain to invoke the iterator
  // TODO: You can use generators to run a simulation
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
    return this.blocks.values()
  }

  async*[Symbol.asyncIterator]() {
    //flush out all blocks
    for (const block of this.blocks.values()) {
      yield block
    }
    while (true) {
      yield new Promise(resolve => {  //https://hackernoon.com/using-async-generators-for-data-streams-f2cd2a1f02b3
        this.blockPushEmitter.once('new_block', block => {
          console.log('Emitting a new block: ', block.hash)
          resolve(block)
        })
      })
    }
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
