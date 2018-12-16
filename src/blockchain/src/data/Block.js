import '../lang/object'
import HasHash from './HasHash'
import HasValidation from './HasValidation'
import { Failure, Success } from '../../../adt/dist/validation'

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
      index: 0,
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
          proofOfWork(this, ''.padStart(this.difficulty, '0'))
        )
      },
      countPendingTransactions () {
        return this.pendingTransactions.length
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
          const result =
            // 1. Check hash length
            this.hash.length === 64 &&
            // 2. Check hash tampering
            this.hash === this.calculateHash() &&
            // 3. Check difficulty was met
            this.hash.toString().substring(0, this.difficulty) ===
              Array(this.difficulty)
                .fill(0)
                .join('') &&
            // 4. Check blocks form a properly linked chain using hashes
            this.previousHash === previous.hash &&
            // 5. Check timestamps
            this.timestamp >= previous.timestamp

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
          index: this.index,
          pendingTransactions: this.countPendingTransactions()
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
