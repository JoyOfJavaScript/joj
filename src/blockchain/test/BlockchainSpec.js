import BitcoinService from '../src/service/BitcoinService'
import Block from '../src/data/Block'
import BlockChain from '../src/data/Blockchain'
import { assert } from 'chai'

// Create blockchain
const coin = BlockChain()

// Adder functions
const addCoin = BitcoinService.addBlock(coin)

// Add coins
const fourDollars = addCoin(Block([]))

console.log('Height: ', coin.height())
console.log(coin.toArray().map(console.log))

describe('Create a valid Blockchain data structure', () => {
  it('Should create a block chain and assert if valid', () => {
    assert.isOk(coin.toArray() instanceof Array)
    const [g, ...blocks] = coin.toArray()
    assert.equal(g.previousHash, '-1')
    assert.isOk(g.hash === '0')
    assert.isOk(BitcoinService.isLedgerValid(coin))
  })
})
