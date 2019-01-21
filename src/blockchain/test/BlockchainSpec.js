import { createBlockchain as BlockChain } from '../src/domain'
import { PerfCount } from '../src/common/proxies'
import { assert } from 'chai'

// Create blockchain with a genesis block
const ledger = PerfCount('validate')(BlockChain())

console.log('Height: ', ledger.height())

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.isOk(ledger.toArray() instanceof Array)
    const [g, ...blocks] = ledger.toArray()
    assert.isOk(blocks.length === 0)
    assert.equal(g.previousHash, '0'.repeat(64))
    assert.isOk(ledger.validate())
  })
})
