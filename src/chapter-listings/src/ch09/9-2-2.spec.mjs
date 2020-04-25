import Block from '@joj/blockchain/domain/Block.js'
import Builders, { Blockchain } from '@joj/blockchain/domain.js'
import Key from '@joj/blockchain/domain/value/Key.js'
import Money from '@joj/blockchain/domain/value/Money.js'
import chai from 'chai'

const { assert } = chai

const { Transaction2: TransactionBuilder } = Builders

const { from, to, having, withDescription, signWith, build: buildTransaction } = TransactionBuilder


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