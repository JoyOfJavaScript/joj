export const Genesis = state => ({
  isGenesis: () => {
    const { data: d, previousHash } = state
    return previousHash === '-1' || (d && d.includes('Genesis'))
  }
})

export default Genesis
