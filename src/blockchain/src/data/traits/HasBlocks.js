const HasBlocks = ({ blocks }) => ({

  /**
   * Returns Genesis (first block) in the chain
   *
   * @return {DataBlock} First block
   */
  genesis() {
    return blocks[0]
  },

  /**
   * Returns last block in the chain
   *
   * @return {DataBlock} Last block
   */
  last() {
    return blocks[blocks.length - 1]
  },

  /**
   * Push a new block into the chain
   * @param {DataBlock} newBlock New block to insert
   * @return {Number} Returns the number of blocks
   */
  push(newBlock) {
    return blocks.push(newBlock)
  },

  /**
   * Computes the length of the chain
   *
   * @return {Number} Length
   */
  length() {
    return blocks.length
  },

  /**
   * Retrieve block at a certain location
   * @param {Number} index Location of block
   * @return {DataBlock} Block at this position/index in the chain
   */
  blockAt(index) {
    return blocks[index]
  },

  /**
   * Return an array representation of this blockchain
   * @return {Array} Blockchain as an array
   */
  toArray() {
    return [...blocks]
  }
})

export default HasBlocks
