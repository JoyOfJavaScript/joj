import Block from '@joj/blockchain/domain/Block.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import chai from 'chai'

const { assert } = chai

describe('5.6.6 - Validating complex data structures', () => {
  it('Calls isValid recusively on the entire blockchain and its items', () => {
    const chain = new Blockchain()
    chain.push(new Block(chain.height() + 1, chain.top.hash, []))
    chain.push(new Block(chain.height() + 2, chain.top.hash, []))
    let validation = chain.validate() // Success
    assert.isTrue(validation.isSuccess)

    chain.top.index = 0 // Alter index in last block and re-validate
    validation = chain.validate()
    assert.isTrue(validation.isFailure) // Failure (Block out of order [previous (2) next (0)])
    console.log(validation.toString())
    assert.equal(validation.toString(), 'Failure (Block out of order [previous (2) next (0)])')
  })
})
