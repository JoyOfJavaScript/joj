/**
 * Used to identify whether a block (simple or transactional) constitutes
 * a Genesis block
 *
 * @param {Object} state State object of block
 * @return {boolean} Returns true|false indicating whether the block is the first one in the chain
 */
export const Genesis = state => ({
  isGenesis: () => {
    const { data, previousHash } = state
    return previousHash === null || data === 'Genesis Block'
  }
})

export default Genesis
