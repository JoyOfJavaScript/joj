import { Failure, Success } from '../../../adt/dist/validation'
import Block from './Block'
import HasValidation from './HasValidation'

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

const Blockchain = (genesis = createGenesisBlock()) => {
  const version = '1.0'
  const blocks = new Map([[genesis.hash.valueOf(), genesis]])
  let top = genesis
  const props = {
    state: {
      timestamp: Date.now(),
      pendingTransactions: []
    },
    methods: {
      top () {
        return top
      },
      push (newBlock) {
        newBlock.blockchain = this
        blocks.set(newBlock.hash.valueOf(), newBlock)
        top = newBlock
        return top
      },
      height () {
        return blocks.size
      },
      lookUp (hash) {
        const h = hash.valueOf()
        if (blocks.has(h)) {
          return blocks.get(h)
        }
        throw new Error(`Block with hash ${h} not found!`)
      },
      /**
       * Helps troubleshooting and testing
       * @return {Array} An array version of all blocks
       */
      toArray () {
        return [...blocks.values()]
      },
      /**
       * Validate the container
       *
       * @return {boolean} Whether the chain is valid
       */
      // TODO: Use an iterator to check all blocks instead of toArray. Delete toArray method and use ...blockchain to invoke the iterator
      // TODO: You can use generators to run a simulation
      isValid () {
        return Success(this.height > 0)
      },
      addPendingTransaction (tx) {
        this.pendingTransactions.push(tx)
      }
    },
    interop: {
      [Symbol.for('version')]: () => version,
      // TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
      [Symbol.iterator]: () => blocks.values(),
      [Symbol.toStringTag]: () => 'Blockchain'
    }
  }
  return Object.assign(
    { ...props.state, ...props.methods, ...props.interop },
    HasValidation()
  )
}

function createGenesisBlock (previousHash = '0'.repeat(64)) {
  const pendingTransactions = [] // Could contain a first transaction like a starting reward
  const genesis = Block(previousHash, pendingTransactions)
  genesis.hash = genesis.calculateHash()
  return genesis
}

export default Blockchain
