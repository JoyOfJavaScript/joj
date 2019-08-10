import * as ValidationsUtil from '@joj/blockchain/domain/shared/validations.mjs'
import {
  checkDifficulty,
  checkIndex,
  checkLinkage
} from '@joj/blockchain/domain/block/validations.mjs'
import { makeChain, makeMoney } from './factory_functions.mjs'
import Blockchain from '@joj/blockchain/domain/Blockchain.mjs'
import Builder from '@joj/blockchain/domain.mjs'
import Money from '@joj/blockchain/domain/value/Money.mjs'
import Transaction from '@joj/blockchain/domain/Transaction.mjs'
import chai from 'chai'

const { assert } = chai

describe('6.4 - Out with the old and in with the new', () => {
  it('Path specifiers (single-valued import/export', () => {
    assert.isNotNull(Transaction)
  })
  it('Multi-valued import/export', () => {
    assert.isNotNull(checkDifficulty)
    assert.isNotNull(checkLinkage)
    assert.isNotNull(checkIndex)
    assert.isFunction(checkIndex)
  })
  it('Wildcard import', () => {
    assert.isNotNull(ValidationsUtil.checkTampering)
    assert.isFunction(ValidationsUtil.checkTampering)
  })
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

  const FeatureFlags = {
    ['USE_NEW_ALGORITHM']: true,
    check(flag, defaultValue) {
      return this[flag] || defaultValue
    }
  }

  it('Dynamic importing (option 1)', async () => {
    return runTest()
  })

  it('Dynamic importing (option 2)', async () => {
    FeatureFlags['USE_NEW_ALGORITHM'] = false
    return runTest()
  })

  it('Dynamic importing with query string params', async () => {
    const { default: computeBalance } = await import(
      '@joj/blockchain/domain/wallet/compute_balance.mjs?v=1'
    )
    assert.isNotNull(computeBalance)
  })

  async function runTest() {
    const useNewAlgorithm = FeatureFlags.check('USE_NEW_ALGORITHM', false)

    let { default: computeBalance } = await import(
      '@joj/blockchain/domain/wallet/compute_balance.mjs'
    )

    if (useNewAlgorithm) {
      computeBalance = (await import('@joj/blockchain/domain/wallet/compute_balance2.mjs')).default
    }

    const ledger = new Blockchain()
    const tx1 = new Transaction('sender123', 'recipient123', (10).jsl(), 'Test')
    const tx2 = new Transaction('sender123', 'recipient123', (10).jsl(), 'Test2')
    ledger.addPendingTransactions(tx1, tx2)
    ledger.newBlock()
    assert.ok(computeBalance('sender123')([...ledger]).equals((-20).jsl()))
    assert.ok(computeBalance('recipient123')([...ledger]).equals((20).jsl()))
  }
})
