import '../lang/object'
import CryptoHasher from './CryptoHasher'
import HasHash from './HasHash'
import HasPendingTransactions from './HasPendingTransactions'

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
 * @param {HashValue} previousHash        Reference to the previous block in the chain
 * @param {CryptoHasher} hasher Hasher to use to hash transactional blocks
 * @return {Block} Newly created block with its own computed hash
 */
const Block = (
  pendingTransactions = [],
  previousHash,
  hasher = CryptoHasher()
) => {
  return Object.mixin(
    {
      state: {
        [Symbol.for('version')]: '1.0',
        difficulty: 2,
        previousHash,
        hash: undefined,
        nonce: 0,
        timestamp: Date.now(),
        pendingTransactions
      },
      methods: {
        /**
         * Execute proof of work algorithm to mine block
         * @return {Promise<Block>} Mined block
         */
        mine: async function () {
          return Promise.resolve(
            proofOfWork(this, ''.padStart(this.difficulty, '0'))
          )
        },
        /**
         * Check whether this block is a genesis block (first block in a any chain)
         * @return {Boolean} Whether this is a genesis block
         */
        isGenesis () {
          return this.previousHash.valueOf() === '-1'
        }
      }
    },
    HasHash({ hasher, keys: ['timestamp', 'previousHash', 'nonce'] }),
    HasPendingTransactions()
  )
}

// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const proofOfWork = (block, hashPrefix, nonce = 1) => {
  if (block.hash && block.hash.toString().startsWith(hashPrefix)) {
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.hash = block.calculateHash(block.pendingTransactionsToString())
  return proofOfWork(block, hashPrefix, nonce + 1)
}

export default Block
