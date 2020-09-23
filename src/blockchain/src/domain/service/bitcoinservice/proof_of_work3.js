// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
export const proofOfWork = (block = throw new Error('Provide a non-null block object!')) => {
  const hashPrefix = ''.padStart(block.difficulty, '0')
  do {
    block.nonce += nextNonce()  //#A
    block.hash = block.calculateHash()
  } while (!block.hash.toString().startsWith(hashPrefix))
  return block
}

function nextNonce() {
  return randomInt(1, 10) + Date.now()
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export default proofOfWork
