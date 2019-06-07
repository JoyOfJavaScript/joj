// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
const proofOfWork = (block, hashPrefix) => {
  do {
    block.nonce += 1
    block.hash = block.calculateHash()
  } while (!block.hash.toString().startsWith(hashPrefix))
  return block
}
export default proofOfWork
