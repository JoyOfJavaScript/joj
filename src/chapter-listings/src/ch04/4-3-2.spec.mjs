import { compose, curry } from '@joj/blockchain/util/fp/combinators.js'
import chai from 'chai'
import crypto from 'crypto'

const { assert } = chai

describe('4.3.2 - The curry and composition duo', () => {
  it('Secure compute cipher for HasHash mixin', () => {
    const computeCipher = (options, data) =>
      crypto
        .createHash(options.algorithm)
        .update(data)
        .digest(options.encoding)

    assert.equal(
      computeCipher(
        {
          algorithm: 'SHA256', //#A
          encoding: 'hex' //#B
        },
        JSON.stringify({
          sender: 'luis@joj.com',
          recipient: 'luke@joj.com',
          funds: 10
        })
      ),
      '04a635cf3f19a6dcc30ca7b63b9a1a6a1c42a9820002788781abae9bec666902'
    )
  })
  it('Implements HasHash mixin', () => {
    const isFunction = a =>
      a && //#A
      typeof a === 'function' &&
      Object.prototype.toString.call(a) === '[object Function]'

    const prop = curry((
      name,
      obj //#A
    ) => (obj[name] && isFunction(obj[name]) ? obj[name].call(obj) : obj[name]))

    const props = curry((names, obj) => names.map(n => prop(n, obj)))

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
        return compose(
          computeCipher(options),
          assemble,
          props(keys)
        )(this)
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
