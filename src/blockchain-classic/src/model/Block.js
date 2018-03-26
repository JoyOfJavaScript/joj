class Block {
  constructor(previousHash) {
    this.previousHash = previousHash
    this.timestamp = Date.now()
    this.hash = ''
    this.nonce = 0
  }

  get hash() {
    return this.hash
  }

  get previousHash() {
    return this.previousHash
  }

  get timestamp() {
    return this.timestamp
  }

  get nonce() {
    return this.nonce
  }
}

export default Block
