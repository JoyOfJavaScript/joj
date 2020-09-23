// TODO: use trampolining to simulate TCO in order to reach mining difficulty 4
export const proofOfWork = (block = throw new Error('Provide a non-null block object!')) => {
  const hashPrefix = ''.padStart(block ?.difficulty ?? 2, '0')
  do {
    block.nonce += 1 //#A
    block.hash = block.calculateHash()  //#B
  } while (!block.hash.toString().startsWith(hashPrefix))  //#C
  return block
}
export default proofOfWork
