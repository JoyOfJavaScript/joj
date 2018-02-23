import BlockChainLogic from './behavior/BlockChainLogic'
import BlockLogic from './behavior/BlockLogic'
import Money from './data/Money'
import BlockChain from './data/Blockchain'
import { compose } from 'ramda'

const prop = name => obj => obj && obj[name]
const append = (a, b) => a + b

const coin = BlockChain()
const addCoin = BlockChainLogic.addBlockTo(coin)

addCoin(BlockLogic.newBlock(1, Date.call(null), Money('USD', 4)))
addCoin(BlockLogic.newBlock(2, Date.call(null), Money('USD', 8)))

console.log(
  coin
    .blocks()
    .map(compose(JSON.stringify, prop('data')))
    .reduce(append)
)
