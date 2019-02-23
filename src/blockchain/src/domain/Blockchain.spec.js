import BlockChain from './Blockchain'
import { PerfCount } from '../common/proxies'
import { assert } from 'chai'

// Create blockchain with a genesis block
const ledger = PerfCount('validate')(new BlockChain())

console.log('Height: ', ledger.height())

describe('Blockchain Spec', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.isOk(ledger.toArray() instanceof Array)
    const [g, ...blocks] = ledger.toArray()
    assert.isOk(blocks.length === 0)
    assert.equal(g.previousHash, '0'.repeat(64))
    assert.isOk(ledger.validate())
  })
})
