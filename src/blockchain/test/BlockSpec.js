import assert from 'assert'
import DataBlock from '../src/data/DataBlock'

describe('Block object', () => {
  it('Should create genesis block', () => {
    const b = DataBlock.genesis()
    assert.deepEqual(b.data, { data: 'Genesis Block' })
    assert.equal(b.previousHash, '-1')
  })
  it('Should init a new block', () => {
    const b = DataBlock({ data: 'test' }, '123')
    assert.deepEqual(b.data, { data: 'test' })
    assert.equal(b.previousHash, '123')
    b.timestamp = 'tomorrow'
    assert.equal(b.timestamp, 'tomorrow')
    const currentHash = b.hash
    b.nonce = 99
    b.calculateHash()
    assert.notEqual(currentHash, b.hash)
  })
})
