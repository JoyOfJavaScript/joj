import Block from './Block'
import HasValidation from './shared/HasValidation'
import { Success } from '../lib/fp/data/validation2'

/**
 * Untamperable blockchain. You may initialize the chain with an existing
 * chain. But the most common thing to do is initialize with an empty Chain
 * and allow itself to bootstrap with a Genesis block.
 */
export default class Blockchain {
  blocks = new Map() // Could be made private, but instance method invocation breaks when called through a proxy
  #version = '1.0'
  constructor (genesis = createGenesisBlock()) {
    this.top = genesis
    this.blocks.set(genesis.hash, genesis)
    this.timestamp = Date.now()
    this.pendingTransactions = []
  }

  push (newBlock) {
    newBlock.blockchain = this
    this.blocks.set(newBlock.hash, newBlock)
    this.top = newBlock
    return this.top
  }

  height () {
    return this.blocks.size
  }

  lookUp (hash) {
    const h = hash
    if (this.blocks.has(h)) {
      return this.blocks.get(h)
    }
    throw new Error(`Block with hash ${h} not found!`)
  }

  newBlock () {
    const block = new Block(this.height, this.top.previousHash, [
      ...this.pendingTransactions
    ])
    this.pendingTransactions = []
    return this.push(block)
  }

  /**
   * Helps troubleshooting and testing
   * @return {Array} An array version of all blocks
   */
  toArray () {
    return [...this.blocks.values()]
  }

  /**
   * Validate the container
   *
   * @return {boolean} Whether the chain is valid
   */
  // TODO: Use an iterator to check all blocks instead of toArray. Delete toArray method and use ...blockchain to invoke the iterator
  // TODO: You can use generators to run a simulation
  isValid () {
    return Success.of(this.height() > 0)
  }

  addPendingTransaction (tx) {
    this.pendingTransactions.push(tx)
  }

  addPendingTransactions (...txs) {
    this.pendingTransactions.push(...txs)
  }

  get [Symbol.for('version')] () {
    return this.#version
  }

  [Symbol.iterator] () {
    return this.blocks.values()
  }
}

Object.assign(Blockchain.prototype, HasValidation())

function createGenesisBlock (previousHash = '0'.repeat(64)) {
  const pendingTransactions = [] // Could contain a first transaction like a starting reward
  const genesis = new Block(1, previousHash, pendingTransactions)
  genesis.hash = genesis.calculateHash()
  return genesis
}
