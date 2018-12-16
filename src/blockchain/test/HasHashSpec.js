import { assert } from 'chai'
import { assemble, computeCipher } from '../src/data/HasHash'

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
    assert.equal(
      assemble(keys.map(k => obj[k])),
      '["luis@joj.com","luke@joj.com",10]'
    )
  })
})
