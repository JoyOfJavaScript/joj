// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
function proofOfWork(block = throw new Error('Provide a non-null block object!')) {
  function runPoW(hashPrefix) {
    if (block.hash && block.hash.toString().startsWith(hashPrefix)) {
      return block
    }
    // Continue to compute the hash again with higher nonce value
    block.nonce += 1
    block.hash = block.calculateHash()
    return runPoW(hashPrefix)
  }
  return runPoW(''.padStart(block.difficulty, '0'))
}
export default proofOfWork
