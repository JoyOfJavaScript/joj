import BlockChain from '../src/data/Blockchain'
import BitcoinService from '../src/service/BitcoinService'
import DataBlock from '../src/data/DataBlock'
import Money from '../src/data/Money'
import { assert } from 'chai'

// Create blockchain
const coin = BlockChain.init()

// Adder functions
const addCoin = BitcoinService.addBlock(coin)

// Add coins
const fourDollars = addCoin(DataBlock(Money('USD', 4)))

console.log('Height: ', coin.height())
console.log(coin.toArray().map(x => x.inspect()))

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.isOk(coin.toArray() instanceof Array)
    const [g, ...blocks] = coin.toArray()
    assert.isNull(g.previousHash)
    assert.isOk(blocks[0].data.equals(fourDollars.data))
    assert.isOk(BitcoinService.isChainValid(coin))
  })
})
