import assert from 'assert'
import BlockChainLogic from '../src/behavior/BlockChainLogic'
import Money from '../src/data/Money'
import DataBlock from '../src/data/DataBlock'
import BlockChain from '../src/data/Blockchain'

// Create blockchain
const coin = BlockChain()

// Adder functions
const addCoin = BlockChainLogic.addBlockTo(coin)
const mineCoin = BlockChainLogic.mineBlockTo(coin)

// Add coins
const fourDollars = addCoin(DataBlock(Money('USD', 4)))
const eightDollars = addCoin(DataBlock(Money('USD', 8)))
const hundredDollars = mineCoin(DataBlock(Money('USD', 100)))

console.log('Number of blocks in chain: ', coin.size())
console.log(coin.blocks().map(x => x.inspect()))

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.ok(BlockChainLogic.isChainValid(coin))
  })

  it('Should assert blocks + data are immutable', () => {
    assert.throws(() => {
      fourDollars.hash = '123'
    }, TypeError)

    assert.throws(() => {
      eightDollars.data.amount = '10000000000'
    }, TypeError)

    assert.throws(() => {
      hundredDollars.hash = '123'
    }, TypeError)
  })
})

// https://www.youtube.com/watch?v=fRV6cGXVQ4I
