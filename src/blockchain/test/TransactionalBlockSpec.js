import TransactionalBlock from '../src/data/TransactionalBlock'
import assert from 'assert'

describe('Transactional Block object', () => {
  it('Should init a new trasactional block', () => {
    const b = TransactionalBlock(['1', '2', '3'], '123')
    assert.deepEqual(b.pendingTransactions, ['1', '2', '3'])
    assert.equal(b.previousHash, '123')
    assert.equal(b.nonce, 0)
  })
  it('Should validate core properties', () => {
    const b = TransactionalBlock(['1', '2', '3'], '123')
    const currentHash = b.hash
    assert.ok(currentHash.length > 0)
    b.nonce = 99
    b.hash = b.calculateHash()
    assert.ok(b.hash.length > 0)
    assert.notEqual(currentHash, b.hash)
  })
})
