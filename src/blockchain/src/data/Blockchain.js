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
       * Determines if the chain is valid by asserting the properties of a blockchain.
       * Namely:
       * 1. Every hash is unique and hasn't been tampered with
       * 2. Every block properly points to the previous block
       *
       * @param {boolean} checkTransactions Whether to check for transactions as well
       * @return {boolean} Whether the chain is valid
       */
      // TODO: Use an iterator to check all blocks instead of toArray. Delete toArray method and use ...blockchain to invoke the iterator
      // TODO: You can use generators to run a simulation
      isValid (checkTransactions = false) {
        return [...validateBlockchain(this, checkTransactions)].reduce(
          (a, b) => a && b
        )
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
    HasPendingTransactions()
  )
}

function createGenesis () {
  const pendingTransactions = [] // Could contain a first transaction like a starting reward
  const previousHash = HashValue('0'.repeat(64))
  const genesis = Block(pendingTransactions, previousHash)
  genesis.hash = genesis.calculateHash()
  return genesis
}

const validateBlockchain = (blockchain, alsoCheckTransactions) => ({
  [Symbol.iterator]: function * () {
    for (const currentBlock of blockchain) {
      if (currentBlock.isGenesis()) {
        yield true
      } else {
        // Compare each block with its previous
        const previousBlock = blockchain.lookUp(currentBlock.previousHash)
        yield validateBlock(currentBlock, previousBlock, alsoCheckTransactions)
      }
    }
  }
})

const validateBlock = (current, previous, checkTransactions) =>
  // 0. Check hash valid
  current.hash.length > 0 &&
  previous.hash.length > 0 &&
  // 1. Check hash tampering
  current.hash.equals(
    current.calculateHash(current.pendingTransactionsToString())
  ) &&
  // 2. Check blocks form a properly linked chain using hashes
  current.previousHash.equals(previous.hash) &&
  // 3. Check timestamps
  current.timestamp >= previous.timestamp &&
  // 4. Verify Transaction signatures
  (checkTransactions ? checkBlockTransactions(current) : true)

const checkBlockTransactions = block =>
  block.hash.toString().substring(0, block.difficulty) ===
    Array(block.difficulty).fill(0).join('') &&
  block.pendingTransactions.every(tx => tx.verifySignature())

export default Blockchain
