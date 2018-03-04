import assert from 'assert'
import Wallet from '../src/data/Wallet'

describe('Wallet Type', () => {
  it('Should create a valid wallet', () => {
    const w = Wallet()
    console.log(w)
    assert.ok(w instanceof Wallet())
  })
})
