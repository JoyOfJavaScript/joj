import * as ValidationsUtil from '@joj/blockchain/domain/shared/validations.js'
import {
  checkDifficulty,
  checkIndex,
  checkLinkage
} from '@joj/blockchain/domain/block/validations.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import Transaction from '@joj/blockchain/domain/Transaction.js'
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
      '@joj/blockchain/domain/wallet/compute_balance.js?v=1'
    )
    assert.isNotNull(computeBalance)
  })

  async function runTest() {
    const useNewAlgorithm = FeatureFlags.check('USE_NEW_ALGORITHM', false)

    let { default: computeBalance } = await import(
      '@joj/blockchain/domain/wallet/compute_balance.js'
    )

    if (useNewAlgorithm) {
      computeBalance = (await import('@joj/blockchain/domain/wallet/compute_balance2.js')).default
    }

    const ledger = new Blockchain()
    const tx1 = new Transaction('sender123', 'recipient123', (10).btc(), 'Test')
    const tx2 = new Transaction('sender123', 'recipient123', (10).btc(), 'Test2')
    ledger.addPendingTransactions(tx1, tx2)
    ledger.newBlock().next()
    assert.ok(computeBalance('sender123')([...ledger]).equals((-20).btc()))
    assert.ok(computeBalance('recipient123')([...ledger]).equals((20).btc()))
  }
})
