import Builders, { Block, Transaction } from '@joj/blockchain/domain.js'
import { makeChain, makeMoney } from './factory_functions.mjs'
import Money from '@joj/blockchain/domain/value/Money.js'
import chai from 'chai'

const { assert } = chai
const { Block: BlockBuilder, Transaction: TransactionBuilder } = Builders

describe('6.5 - Import patterns', () => {

  it('Test proxy export', () => {
    const tx = new Transaction('luis@joj.com', 'luke@joj.com', 10)
    assert.equal(tx.sender, 'luis@joj.com')
    assert.equal(tx.recipient, 'luke@joj.com')
    assert.equal(tx.calculateHash().length, 64)
    assert.equal(
      tx.displayTransaction(),
      'Transaction Generic from luis@joj.com to luke@joj.com for 10'
    )

    const b = new Block(1, 'ABC123', [])
    assert.equal(b.index, 1)
    assert.equal(b.previousHash, 'ABC123')
    assert.isNotTrue(b.isGenesis())
    assert.isOk(b.calculateHash().length, 64)
  })

  it('Factory functions', () => {
    const m = makeMoney('₿', 10)
    assert.equal(m.currency, '₿')
    assert.equal(m.amount, 10)

    const chain = makeChain()
    assert.equal(chain.height(), 1)
  })

  it('Builder functions', () => {
    // Block
    const b = Object.create(BlockBuilder)
      .at(1)
      .linkedTo('-1')
      .withPendingTransactions([])
      .build()
    assert.equal(b.previousHash, '-1')
    assert.isEmpty(b.data)

    // Transaction
    const tx = new TransactionBuilder()
      .from('sally')
      .to('luke')
      .having(Money('₿', 0.1))
      .withDescription('Test')
      .build()

    assert.isNotEmpty(tx.id)
    assert.equal(tx[Symbol.for('version')], '1.0')
  })
})
