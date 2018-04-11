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

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  /* async */ mineBlock,
}

export default BlockLogic
