// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const proofOfWork = (block, hashPrefix) => {
  if (block.hash && block.hash.toString().startsWith(hashPrefix)) {
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce += 1
  block.hash = block.calculateHash()
  return proofOfWork(block, hashPrefix)
}
export default proofOfWork
