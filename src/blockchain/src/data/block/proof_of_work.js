// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const proofOfWork = (block, hashPrefix, nonce = 1) => {
  if (block.hash && block.hash.toString().startsWith(hashPrefix)) {
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.hash = block.calculateHash()
  return proofOfWork(block, hashPrefix, nonce + 1)
}
export default proofOfWork
