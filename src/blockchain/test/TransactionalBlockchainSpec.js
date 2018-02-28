import assert from 'assert'
import BlockChainLogic from '../src/behavior/BlockChainLogic'
import BlockLogic from '../src/behavior/BlockLogic'
import Money from '../src/data/Money'
import TransactionalBlockchain from '../src/data/TransactionalBlockchain'

// Create blockchain
const coin = TransactionalBlockchain()
const addCoin = BlockChainLogic.addBlockTo(coin)
const mineCoin = BlockChainLogic.mineBlockTo(coin)

// Add coins
const fourDollars = addCoin(
  BlockLogic.newBlock(Date.call(null), Money('USD', 4))
)
const eightDollars = addCoin(
  BlockLogic.newBlock(Date.call(null), Money('USD', 8))
)
const hundredDollars = mineCoin(
  BlockLogic.newBlock(Date.call(null), Money('USD', 100))
)

//console.log(coin.blocks().map(JSON.stringify))

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
