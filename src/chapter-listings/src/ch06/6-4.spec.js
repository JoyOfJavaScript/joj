const chai = require('chai')

const { assert } = chai

const FeatureFlags = {
  ['USE_NEW_ALGORITHM']: true,
  check(flag, defaultValue) {
    return this[flag] || defaultValue
  }
}

describe('6.4 - Out with the old and in with the new', () => {
  it('Dynamic importing (option 1)', () => {
    const useNewAlgorithm = FeatureFlags.check('USE_NEW_ALGORITHM', false)

    let { computeBalance } = require('./wallet/compute_balance.js')

    if (useNewAlgorithm) {
      computeBalance = require('./wallet/compute_balance2.js').computeBalance
    }

    assert.equal(computeBalance(), 72)
  })

  it('Dynamic importing (option 2)', () => {
    FeatureFlags['USE_NEW_ALGORITHM'] = false
    const useNewAlgorithm = FeatureFlags.check('USE_NEW_ALGORITHM', false)

    let { computeBalance } = require('./wallet/compute_balance.js')

    if (useNewAlgorithm) {
      computeBalance = require('./wallet/compute_balance2.js').computeBalance
    }

    assert.equal(computeBalance(), 42)
  })
})
