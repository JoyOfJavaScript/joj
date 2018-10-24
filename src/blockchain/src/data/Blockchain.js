import Block from './Block'
import HasPendingTransactions from './HasPendingTransactions'

// Alternate solution: http://2ality.com/2013/03/subclassing-builtins-es6.html

// TODO
// implement block as a linked list
// store blockchain to file db

/**
 * Untamperable blockchain. You may initialize the chain with an existing
 * chain. But the most common thing to do is initialize with an empty Chain
 * and allow itself to bootstrap with a Genesis block.
 *
 * @param {Block} genesis Genesis block or first block in the chain
 * @return {Blockchain} Returns a blockchain object
 */
// Talk about species and the species pattern
// http://exploringjs.com/es6/ch_classes.html#sec_species-pattern

const Blockchain = (genesis = createGenesis()) => {
  const version = '1.0'
  const timestamp = new Date()
  const blocks = new Map([[genesis.hash, genesis]])

  let top = genesis

  const props = {
    // meta properties
    [Symbol.for('version')]: () => version,
    // TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
    [Symbol.iterator]: () => blocks.values(),
    [Symbol.toStringTag]: () => 'Blockchain',

    // instance properties
    pendingTransactions: [],

    // instance methods
    timestamp: () => timestamp,
    top: () => top,
    push: newBlock => {
      blocks.set(newBlock.hash, newBlock)
      top = newBlock
      return newBlock
    },
    height: () => blocks.size,
    lookUp: hash =>
      (blocks.has(hash)
        ? blocks.get(hash)
        : (() => {
          throw new Error(`Block with hash ${hash} not found!`)
        })()),
    toArray: () => [...blocks.values()]
  }
  return Object.concat(props, HasPendingTransactions(props))
}

function createGenesis () {
  const pendingTransactions = [], previousHash = '-1', hash = '0'
  const genesis = Block(pendingTransactions, previousHash)
  genesis.hash = hash
  return genesis
}

export default Blockchain
