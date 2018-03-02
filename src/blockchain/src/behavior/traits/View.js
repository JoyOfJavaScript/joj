/**
 * Provides an inspect method (mainly for debugging purposes) containing the state of
 * a block
 *
 * @param {Object} state State object of block
 * @return {String} Returns a string that reflects the state of the block
 */
export const View = state => ({
  inspect: () => {
    const { timestamp, data, previousHash, hash } = state
    return `Block {ts: ${timestamp}, data: ${JSON.stringify(data)},\
       ph: ${previousHash}, h: ${hash}}`
  }
})

export default View
