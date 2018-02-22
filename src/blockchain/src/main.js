import BlockChainLogic from './behavior/BlockChainLogic'
import BlockLogic from './behavior/BlockLogic'
import Money from './data/Money'
import BlockChain from './data/Blockchain'

const coin = BlockChain()
const addCoin = BlockChainLogic.appendBlock(coin)

addCoin(BlockLogic.newBlock(1, Date.call(null), Money('USD', 4)))
addCoin(BlockLogic.newBlock(2, Date.call(null), Money('USD', 8)))

console.log(
  coin.blocks().map(JSON.stringify)
  //    .reduce(append)
)

const append = (a, b) => a + b
