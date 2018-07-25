class BlockHeader {
  previousHash = undefined
  timestamp = Date.now()
  hash = ''
  nonce = 0
  difficulty = 2
  version = '1.0'

  constructor (previousHash) {
    this.previousHash = previousHash
  }

  get hash () {
    return this.hash
  }

  get previousHash () {
    return this.previousHash
  }

  get timestamp () {
    return this.timestamp
  }

  get nonce () {
    return this.nonce
  }

  get difficulty () {
    return this.difficulty
  }

  toString () {
    return `[BlockHeader] {hash: ${this.hash || 'TBD'}, previousHash: ${this.previousHash || 'TBD'}, timestamp: ${this.timestamp}}`
  }
}

export default BlockHeader
