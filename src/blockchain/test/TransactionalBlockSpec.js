import assert from 'assert'
import TransactionalBlock from '../src/data/TransactionalBlock'

describe('Transactional Block object', () => {
  it('Should init a new block', () => {
    const b = TransactionalBlock('now', ['1', '2', '3'], '123')
    assert.equal(b.timestamp, 'now')
    assert.deepEqual(b.transactions, ['1', '2', '3'])
    assert.equal(b.previousHash, '123')
  })
})
