import { compose, curry, prop, props } from '@joj/blockchain/util/fp/combinators.js'
import Money from '@joj/blockchain/domain/value/Money.js'
import chai from 'chai'
import crypto from 'crypto'

const { assert } = chai

describe('4.4 - Working with immutable objects', () => {
  it('Working with Money Value Object', () => {
    assert.equal(Money('₿', 1.0).currency, '₿')
    assert.equal(Money('₿', 1.0).amount, 1)
    assert.equal(Money('$', 1.0).currency, '$')
    assert.equal(Money('$', 1.0).amount, 1)
    assert.equal(Money.zero('$').amount, 0)
    assert.equal(Money.zero('$').currency, '$')
    const USD = Money('$')
    assert.equal(USD(3.0).currency, '$')
    assert.equal(USD(3.0).amount, 3)
    assert.equal(USD(7.0).currency, '$')
    const add = (x, y) => x + y
    assert.equal([USD(3.0), USD(7.0)].map(prop('amount')).reduce(add, 0), 10)
    assert.isTrue(
      USD(3.0)
        .plus(USD(7.0))
        .equals(USD(10))
    )
    const threeDollars = USD(3.0)
    assert.throws(
      () => {
        threeDollars.amount = 5
      },
      TypeError,
      "Cannot assign to read only property 'amount' of object '[object $3]'"
    )

    assert.isTrue(Object.isFrozen(threeDollars))

    assert.throws(
      () => {
        threeDollars.goBankrupt = true
      },
      TypeError,
      'Cannot add property goBankrupt, object is not extensible'
    )

    assert.throws(
      () => {
        delete threeDollars.plus
      },
      TypeError,
      "Cannot delete property 'plus' of [object $3]"
    )

    assert.isTrue(Object.isSealed(threeDollars))
  }),
    it('Implements HasHash mixin by sending copy of data', () => {
      const assemble = (...pieces) => pieces.map(JSON.stringify).join('')

      const computeCipher = curry((options, data) =>
        crypto
          .createHash(options.algorithm)
          .update(data)
          .digest(options.encoding)
      )
      const HasHash = (
        keys,
        options = {
          algorithm: 'SHA256',
          encoding: 'hex'
        }
      ) => ({
        calculateHash() {
          const objToHash = Object.fromEntries(new Map(keys.map(k => [k, prop(k, this)])))
          return compose(
            computeCipher(options),
            assemble,
            props(keys)
          )(objToHash)
        }
      })

      const hashTransaction = Object.assign(
        {
          sender: 'luis@joj.com',
          recipient: 'luke@joj.com',
          funds: 10
        },
        HasHash(['sender', 'recipient', 'funds'])
      )

      assert.equal(
        hashTransaction.calculateHash(),
        '1d39e9fdd62716d90daa02756bef63f8c65fd38073bdd7722860254870668907'
      )
    })
})
