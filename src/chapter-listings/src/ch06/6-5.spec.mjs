import { makeChain, makeMoney } from './factory_functions.mjs'
import Builder from '@joj/blockchain/domain.mjs'
import Money from '@joj/blockchain/domain/value/Money.mjs'
import chai from 'chai'

const { assert } = chai

describe('6.5 - Import patterns', () => {
  it('Factory functions', () => {
    const m = makeMoney('jsl', 10)
    assert.equal(m.currency, 'jsl')
    assert.equal(m.amount, 10)

    const chain = makeChain()
    assert.equal(chain.height(), 1)
  })

  it('Builder functions', () => {
    // Block
    const b = new Builder.Block()
      .at(1)
      .linkedTo('-1')
      .withPendingTransactions([])
      .build()
    assert.equal(b.previousHash, '-1')
    assert.isEmpty(b.data)

    // Transaction
    const tx = new Builder.Transaction()
      .from('sally')
      .to('luke')
      .having(Money('₿', 0.1))
      .withDescription('Test')
      .build()

    assert.isNotEmpty(tx.id)
    assert.equal(tx[Symbol.for('version')], '1.0')
  })
})
