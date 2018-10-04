import DataBlock from './DataBlock'
import HasPendingTransactions from './HasPendingTransactions'

// Alternate solution: http://2ality.com/2013/03/subclassing-builtins-es6.html

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

const Blockchain = genesis => {
  const version = '1.0'
  const timestamp = new Date()
  const blocks = [genesis]

  return Object.concat(
    {
      [Symbol.for('version')]: version,
      /**
   * Returns Genesis (first block) in the chain
   *
   * @return {DataBlock} First block
   */
      genesis () {
        return blocks[0]
      },

      /**
   * Returns last block in the chain
   *
   * @return {DataBlock} Last block
   */
      last () {
        return blocks[blocks.length - 1]
      },

      /**
   * Push a new block into the chain
   * @param {DataBlock} newBlock New block to insert
   * @return {Number} Returns the number of blocks
   */
      push (newBlock) {
        return blocks.push(newBlock)
      },

      /**
   * Computes the height (similar to length) of the chain
   *
   * @return {Number} Length
   */
      height () {
        return blocks.length
      },

      /**
   * Retrieve block at a certain location
   * @param {Number} index Location of block
   * @return {DataBlock} Block at this position/index in the chain
   */
      blockAt (index) {
        return blocks[index]
      },

      /**
   * Return an (new) array representation of this blockchain
   * @return {Array} Blockchain as an array
   */
      toArray () {
        return [...blocks]
      },

      get timestamp () {
        return timestamp
      }
    },
    HasPendingTransactions({})
  )
}

Blockchain.init = () => {
  const g = DataBlock.genesis()
  g.hash = g.calculateHash()
  return Blockchain(g)
}

export default Blockchain
