import '../lang/object'
import { Failure, Success } from '../../../adt/dist/validation'
import { curry } from '../../../adt/dist/combinators'
import HasHash from './HasHash'
import HasValidation from './HasValidation'

/**
 * Transactional blocks contain the set of all pending transactions in the chain
 * These are used to move/transfer assets around within transactions
 * Bitcoins are a good example of transactional blocks.
 *
 * Hashes constitute the digital fingerprint of a block. They are calcualted using all of the
 * properties of such block. Blocks are immutable with respect to their hash, if the hash of a block
 * changes, it's a different block
 *
 * @param {Array}     pendingTransactions Array of pending transactions from the chain
 * @param {String} previousHash        Reference to the previous block in the chain
 * @return {Block} Newly created block with its own computed hash
 */
const Block = (pendingTransactions = [], previousHash) => {
  const props = {
    state: {
      previousHash,
      pendingTransactions,
      difficulty: 2,
      hash: undefined, // Gets computed later
      nonce: 0,
      timestamp: Date.now()
    },
    methods: {
      /**
       * Set the blockchain container this block is part of
       * @param {Blockchain} chain Blockchain object
       * @return {Block} This block's reference
       */
      set blockchain (chain) {
        this.chain = chain
        return this
      },
      /**
       * Get the blockchain container this block is part of
       * @return {Blockchain} This block's reference
       */
      get blockchain () {
        return this.chain
      },
      /**
       * Execute proof of work algorithm to mine block
       * @return {Promise<Block>} Mined block
       */
      mine: async function () {
        return Promise.resolve(
          proofOfWork(this, ''.padStart(this.difficulty, '0'), this.nonce)
        )
      },
      /**
       * Check whether this block is a genesis block (first block in a any chain)
       * @return {Boolean} Whether this is a genesis block
       */
      isGenesis () {
        return this.previousHash.valueOf() === '0'.repeat(64)
      },
      isValid () {
        if (this.isGenesis()) {
          return Success(true)
        } else {
          // Compare each block with its previous
          const previous = this.blockchain.lookUp(this.previousHash)

          const checkLength = curry((len, b) => () => b.hash.length === len)
          const checkNoTampering = b => b.hash === b.calculateHash()
          const checkDifficulty = curry(
            (difficulty, b) =>
              b.hash.substring(0, difficulty) === '0'.repeat(difficulty)
          )
          const checkLinkage = curry((p, b) => b.previousHash === p.hash)
          const checkTimestamps = curry((p, b) => b.timestamp >= p.timestamp)

          const result = [
            checkLength(64),
            checkNoTampering,
            checkDifficulty(this.difficulty),
            checkLinkage(previous),
            checkTimestamps(previous)
          ].every(f => f(this))
          // .reduce((r, f) => r && f(this))

          return result
            ? Success(true)
            : Failure([`Validation failed for block ${this.hash}`])
        }
      },
      /**
       * Returns the minimal JSON representation of this object
       * @return {Object} JSON object
       */
      toJSON () {
        return {
          previousHash: this.previousHash,
          hash: this.hash,
          nonce: this.nonce,
          timestamp: this.timestamp,
          pendingTransactions: this.pendingTransactions.length
        }
      }
    },
    interop: {
      [Symbol.for('version')]: () => '1.0',
      // TODO: in chapter on symbols, create a symbol for [Symbol.observable] then show validating blockchain using it
      [Symbol.iterator]: () => pendingTransactions[Symbol.iterator](),
      [Symbol.toStringTag]: () => 'Block'
    }
  }
  return Object.assign(
    { ...props.state, ...props.methods, ...props.interop },
    HasHash(['timestamp', 'previousHash', 'nonce', 'pendingTransactions']),
    HasValidation()
  )
}

// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const proofOfWork = (block, hashPrefix, nonce = 1) => {
  if (block.hash && block.hash.toString().startsWith(hashPrefix)) {
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.hash = block.calculateHash()
  return proofOfWork(block, hashPrefix, nonce + 1)
}

export default Block
