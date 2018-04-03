import assert from 'assert'
import BlockchainLogic from '../src/behavior/BlockchainLogic'
import Money from '../src/data/Money'
import DataBlock from '../src/data/DataBlock'
import BlockChain from '../src/data/Blockchain'

// Create blockchain
const coin = BlockChain.init()

// Adder functions
const addCoin = BlockchainLogic.addBlockTo(coin)

// Add coins
const fourDollars = addCoin(DataBlock(Money('USD', 4)))

console.log('Number of blocks in chain: ', coin.length)
console.log(coin.map(x => x.inspect()))

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.ok(coin instanceof Array)
    const [g, ...blocks] = coin
    assert.equal(g.previousHash, '-1')
    assert.ok(blocks[0].data.equals(fourDollars.data))
    assert.ok(BlockchainLogic.isChainValid(coin))
  })
})
