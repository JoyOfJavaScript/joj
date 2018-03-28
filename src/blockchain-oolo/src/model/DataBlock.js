import BlockHeader from './BlockHeader'

const DataBlock = Object.create(BlockHeader)

DataBlock.init = function(previousHash, data) {
  this.init(previousHash)
  this.data = data
  return this
}

// Static
DataBlock.genesis = data =>
  DataBlock.init('-1', data || { data: 'Genesis Block' })

export default DataBlock
