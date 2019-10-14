// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const proofOfWork = (block, hashPrefix) => {
  do {
    block.nonce += nextNonce()
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
