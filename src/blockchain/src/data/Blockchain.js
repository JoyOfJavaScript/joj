import Block from './Block'
import HasPendingTransactions from './HasPendingTransactions'
import HashValue from './HashValue'

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
  const blocks = new Map([[genesis.hash.valueOf(), genesis]])
  let top = genesis
  return Object.mixin(
    {
      state: {
        timestamp: Date.now(),
        pendingTransactions: []
      },
      methods: {
        top () {
          return top
        },
        push (newBlock) {
          blocks.set(newBlock.hash.valueOf(), newBlock)
          top = newBlock
          return newBlock
        },
        height () {
          return blocks.size
        },
        lookUp (hash) {
          if (blocks.has(hash.valueOf())) {
            return blocks.get(hash.valueOf())
          }
          throw new Error(`Block with hash ${hash.valueOf()} not found!`)
        },
        toArray () {
          return [...blocks.values()]
        }
      },
      interop: {
        [Symbol.for('version')]: () => version,
        // TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
        [Symbol.iterator]: () => blocks.values(),
        [Symbol.toStringTag]: () => 'Blockchain'
      }
    },
    HasPendingTransactions()
  )
}

function createGenesis () {
  const pendingTransactions = [], // Could contain a first transaction like a reward
    previousHash = HashValue('-1', true),
    hash = HashValue('0'.repeat(64))
  const genesis = Block(pendingTransactions, previousHash)
  genesis.hash = hash
  return genesis
}

export default Blockchain
