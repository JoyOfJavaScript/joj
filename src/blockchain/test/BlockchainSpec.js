import BlockChain from '../src/data/Blockchain'
import BitcoinService from '../src/service/BitcoinService'
import DataBlock from '../src/data/DataBlock'
import Money from '../src/data/Money'
import assert from 'assert'

// Create blockchain
const coin = BlockChain.init()

// Adder functions
const addCoin = BitcoinService.addBlock(coin)

// Add coins
const fourDollars = addCoin(DataBlock(Money('USD', 4)))

console.log('Number of blocks in chain: ', coin.length)
console.log(coin.toArray().map(x => x.inspect()))

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.ok(coin.toArray() instanceof Array)
    const [g, ...blocks] = coin.toArray()
    assert.equal(g.previousHash, '-1')
    assert.ok(blocks[0].data.equals(fourDollars.data))
    assert.ok(BitcoinService.isChainValid(coin))
  })
})
