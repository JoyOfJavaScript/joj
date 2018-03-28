const BlockHeader = {
  init: function(previousHash) {
    this.previousHash = previousHash
    this.timestamp = Date.now()
    this.hash = ''
    this.nonce = 0
    this.difficulty = 2
    this.version = '1.0'
    return this
  }
}

export default BlockHeader
