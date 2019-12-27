import Block from '../../Block.mjs'
import chai from 'chai'
import proofOfWorfk from './proof_of_work.mjs'

const { assert } = chai

describe('Proof of work', () => {
  it('Calls proof of work with low difficulty', () => {
    const block = new Block(1, 'PREV', [], 2)
    proofOfWorfk(block, ''.padStart(block.difficulty, '0'))
    assert.isOk(block.nonce > 0)
  })

  it('Calls proof of work async', () => {
    const block = new Block(1, 'PREV', [], 2)
    const ret = proofOfWorkAsync(block)
      .then(() => {
        assert.isOk(block.nonce > 0)
      })
    assert.equal(block.nonce, 0)
    return ret
  })

  it('Run two proof of work in parallel', () => {
    return Promise.all([
      proofOfWorkAsync(new Block(1, 'PREV', [], 1)),
      proofOfWorkAsync(new Block(1, 'PREV', [], 2))
    ])
      .then(([blockDiff2, blockDiff3]) => {
        assert.isOk(blockDiff2.hash.startsWith('0'))
        assert.isOk(blockDiff3.hash.startsWith('00'))
      })
  })


  it('Race two proof of work', () => {
    return Promise.race([
      proofOfWorkAsync(new Block(1, 'PREV', [], 1)),
      proofOfWorkAsync(new Block(2, 'PREV', [], 2))
    ])
      .then(blockWinner => {
        assert.isOk(blockWinner.hash.startsWith('0'))
        assert.equal(blockWinner.index, 1)
      })
  })
})


function proofOfWorkAsync(block) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(proofOfWorfk(block, ''.padStart(block.difficulty, '0')))
    }, 1000)
  })
}