import Block from '../../Block.js'
import chai from 'chai'
import crypto from 'crypto'
import proofOfWork from './proof_of_work.js'

const { assert } = chai

function randomId() {
  return crypto.randomBytes(16).toString("hex")
}

describe('Proof of work', () => {
  it('Calls proof of work with low difficulty', () => {
    let block = new Block(1, randomId(), ['a', 'b', 'c'], 2)
    block = proofOfWork(block)
    assert.isOk(block.nonce > 0)
  })

  it('Calls proof of work async', () => {
    const block = new Block(1, randomId(), ['a', 'b', 'c'], 2)
    const ret = proofOfWorkAsync(block)
      .then(() => {
        assert.isOk(block.nonce > 0)
      })
    assert.equal(block.nonce, 0)
    return ret
  })

  it('Run two proof of work in parallel', () => {
    return Promise.all([
      proofOfWorkAsync(new Block(1, randomId(), ['a', 'b', 'c'], 1), 500),
      proofOfWorkAsync(new Block(2, randomId(), [1, 2, 3], 2), 1000)
    ])
      .then(([blockDiff2, blockDiff3]) => {
        assert.isOk(blockDiff2.hash.startsWith('0'))
        assert.isOk(blockDiff3.hash.startsWith('00'))
      })
  })


  it('Race two proof of work', () => {
    return Promise.race([
      proofOfWorkAsync(new Block(1, randomId(), ['a', 'b', 'c'], 1)),
      proofOfWorkAsync(new Block(2, randomId(), [1, 2, 3], 2))
    ])
      .then(blockWinner => {
        assert.isOk(blockWinner.hash.startsWith('0'))
        assert.equal(blockWinner.index, 1)
      })
  })
})


function proofOfWorkAsync(block, after = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(proofOfWork(block))
    }, after)
  })
}