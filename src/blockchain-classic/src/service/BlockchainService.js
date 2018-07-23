class BlockchainService {
  blockService
  constructor (blockService) {
    this.blockService = blockService
  }

  get blockService () {
    return this.blockService
  }
}

export default BlockchainService
