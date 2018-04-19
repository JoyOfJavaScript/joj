import Logger from '../common/Logger'

const mineBlock = async (difficulty, block) =>
  new Promise((resolve, _) => {
    resolve(
      compareHashUntil(
        block,
        Array(difficulty)
          .fill(0)
          .join('')
      )
    )
  })

// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const compareHashUntil = (block, difficulty, nonce = 1) => {
  if (block.hash.startsWith(difficulty)) {
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.calculateHash()
  return compareHashUntil(block, difficulty, nonce + 1)
}

const handler = {
  apply(target, thisArg, ...args) {
    const newBlock = Reflect.apply(target, thisArg, ...args)
    return newBlock.then(b => {
      Logger.trace(`New block mined! ${b.hash}`)
      return b
    })
  },
}

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  mineBlock: process.env.LOG ? new Proxy(mineBlock, handler) : mineBlock,
}

export default BlockLogic
