import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import chai from 'chai'

const { assert } = chai


describe('9.2.2 - Creting iterable objects', () => {
  it('Listing 9.2 Custom generator function', () => {
    const chain = new Blockchain()
    let i = 0
    for (const block of chain.newBlock()) {
      if (i >= 19) { //#D
        break
      }
      console.log('Hash:', block.hash)
      i++
    }
    assert.equal(chain.height(), 21)

  })
})