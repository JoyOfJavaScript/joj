import Logger from '../common/Logger'

const mineBlock = async (difficulty, block) =>
  Promise.resolve(compareHashUntil(block, ''.padStart(difficulty, '0')))

// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const compareHashUntil = (block, hashPrefix, nonce = 1) => {
  if (block.hash.startsWith(hashPrefix)) {
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.hash = block.calculateHash()
  return compareHashUntil(block, hashPrefix, nonce + 1)
}

const handler = {
  apply (target, thisArg, ...args) {
    const newBlock = Reflect.apply(target, thisArg, ...args)
    return newBlock.then(b => {
      Logger.trace(`New block mined! ${b.hash}`)
      return b
    })
  }
}

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  mineBlock: process.env.LOG ? new Proxy(mineBlock, handler) : mineBlock
}

export default BlockLogic
