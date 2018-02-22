/**
 * Represents a single block in the chain
 *
 * @param {String} index        Location of block in the chain (optional)
 * @param {String} timestamp    When the block was created
 * @param {Object} data         Data associated with this block
 * @param {String} previousHash Reference to the previous block in the chain
 * @param {Function} hasherFn   Function used to compute a SHA256 hash for this block
 */
const Block = (index, timestamp, data = {}, previousHash = '', hasherFn) => ({
  index,
  timestamp,
  data,
  previousHash,
  hash: hasherFn(index, timestamp, data, previousHash),
  inspect: ''
})

export default Block
