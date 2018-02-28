export const View = state => ({
  inspect: () => {
    const { timestamp, data, previousHash, hash } = state
    return `Block {ts: ${timestamp}, data: ${JSON.stringify(data)},\
       ph: ${previousHash}, h: ${hash}}`
  }
})

export default View
