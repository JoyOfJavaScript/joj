/**
 * Used to identify whether a block (simple or transactional) constitutes
 * a Genesis block
 *
 * @param {Object} state State object of block
 * @return {Boolean} Returns true|false indicating whether the block is the first one in the chain
 */
export const Genesis = state => ({
  isGenesis: () => {
    const { data: d, previousHash } = state
    return previousHash === '-1' || (d && d.includes('Genesis'))
  }
})

export default Genesis
