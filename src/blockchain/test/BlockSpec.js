import Block from '../src/data/Block'
import { assert } from 'chai'

describe('Block Spec', () => {
  it('Should create genesis block', () => {
    const b = Block([], '-1')
    assert.equal(b.previousHash, '-1')
  })

  it('Should init a new block', () => {
    const b = Block([], '123')
    assert.equal(b.previousHash, '123')
    b.timestamp = 'tomorrow'
    assert.equal(b.timestamp, 'tomorrow')
    const currentHash = b.hash
    b.nonce = 99
    b.hash = b.calculateHash()
    assert.notEqual(currentHash, b.hash)
  })
  it('Should init a new trasactional block', () => {
    const b = Block(['1', '2', '3'], '123')
    assert.deepEqual(b.pendingTransactions, ['1', '2', '3'])
    assert.equal(b.previousHash, '123')
    assert.equal(b.nonce, 0)
  })
  it('Should validate core properties', () => {
    const b = Block(['1', '2', '3'], '123')
    b.hash = b.calculateHash()
    const currentHash = b.hash
    assert.ok(currentHash.length > 0)
    b.nonce = 99
    b.hash = b.calculateHash()
    console.log('Hash: ', b.hash)
    assert.ok(b.hash.length > 0)
    assert.notEqual(currentHash, b.hash)
  })
})
