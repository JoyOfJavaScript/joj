import BitcoinService from '../src/service/BitcoinService'
import BlockChain from '../src/data/Blockchain'
import { assert } from 'chai'

// Create blockchain with a genesis block
const ledger = BlockChain()

console.log('Height: ', ledger.height())
console.log(ledger.toArray().map(console.log))

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.isOk(ledger.toArray() instanceof Array)
    const [g, ...blocks] = ledger.toArray()
    assert.isOk(blocks.length === 0)
    assert.equal(g.previousHash, '0'.repeat(64))
    assert.isOk(new BitcoinService(ledger).isLedgerValid())
  })
})
