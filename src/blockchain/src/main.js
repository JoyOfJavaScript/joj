import BlockChainLogic from './behavior/BlockChainLogic'
import BlockLogic from './behavior/BlockLogic'
import Money from './data/Money'

const coin = BlockChainLogic.newBlockChain()
const addCoins = BlockChainLogic.appendBlock(coin)

addCoins(BlockLogic.newBlock(1, Date.call(null), Money('USD', 4)))
addCoins(BlockLogic.newBlock(2, Date.call(null), Money('USD', 8)))
