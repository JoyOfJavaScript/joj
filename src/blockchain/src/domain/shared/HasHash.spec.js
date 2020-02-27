import { assemble, computeCipher } from './has_hash.js'
import HasHash from './HasHash.js'
import chai from 'chai'

const { assert } = chai

describe('Has Hash Spec', () => {
  it('Should compute a SHA256 cicpher', () => {
    const obj = {
      sender: 'luis@joj.com',
      recipient: 'luke@joj.com',
      funds: 10.0
    }
    assert.equal(
      computeCipher(
        {
          algorithm: 'SHA256',
          encoding: 'hex'
        },
        JSON.stringify(obj)
      ),
      '04a635cf3f19a6dcc30ca7b63b9a1a6a1c42a9820002788781abae9bec666902'
    )
    const keys = ['sender', 'recipient', 'funds']
    assert.equal(assemble(keys.map(k => obj[k])), '["luis@joj.com","luke@joj.com",10]')
  })

  it('Hashes a simple object literal', () => {
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
