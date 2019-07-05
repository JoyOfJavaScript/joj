import Block from './Block.mjs'
import Blockchain from './Blockchain.mjs'
import { PerfCount } from '../common/proxies.mjs'
import chai from 'chai'

const { assert } = chai

// Create blockchain with a genesis block
const ledger = PerfCount('validate')(new Blockchain())

console.log('Height: ', ledger.height())

describe('Blockchain Spec', () => {
  it('Should create a block chain and assert if valid', () => {
    const [g, ...blocks] = [...ledger]
    assert.isOk(blocks.length === 0)
    assert.equal(g.previousHash, '0'.repeat(64))
    assert.isOk(ledger.validate())
  })

  it('Should fail validation of two consecutive blocks', async () => {
    const chain = new Blockchain()
    let top = chain.push(new Block(chain.height() + 1, chain.top.hash, []))
    assert.equal(top.index, 2)
    top = chain.push(new Block(chain.height() + 1, chain.top.hash, []))
    assert.equal(top.index, 3)
    chain.top.index = 0 // tamper with index
    const validation = chain.validate()
    console.log(validation.toString())
    assert.isOk(validation.isFailure)
  })
})
