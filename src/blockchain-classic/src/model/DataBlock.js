import Block from './Block'

class DataBlock extends Block {
  constructor(previousHash, data) {
    super(previousHash)
    this.data = data
  }

  get data() {
    return this.data
  }

  static genesis(data) {
    return new DataBlock('-1', data || { data: 'Genesis Block' })
  }
}

export default DataBlock
