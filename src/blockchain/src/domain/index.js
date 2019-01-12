import Block from './Block.js'
import HasHash from './shared/HasHash'
import HasValidation from './shared/HasValidation'

/**
 * Transactional blocks contain the set of all pending transactions in the chain
 * These are used to move/transfer assets around within transactions
 * Bitcoins are a good example of transactional blocks.
 *
 * Hashes constitute the digital fingerprint of a block. They are calcualted using all of the
 * properties of such block. Blocks are immutable with respect to their hash, if the hash of a block
 * changes, it's a different block
 * @param {Number} id                  Block ID
 * @param {String} previousHash        Reference to the previous block in the chain
 * @param {Array}  pendingTransactions Array of pending transactions from the chain
 * @return {Block} Newly created block with its own computed hash
 */
export const initBlock = (id, previousHash, pendingTransactions) =>
  Object.assign(
    new Block(id, previousHash, pendingTransactions),
    HasHash(['timestamp', 'previousHash', 'nonce', 'pendingTransactions']),
    HasValidation()
  )

export default { initBlock }
