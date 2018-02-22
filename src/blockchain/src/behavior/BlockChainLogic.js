import BlockChain from '../data/Blockchain'
import Block from '../data/Block'
import BlockLogic from './BlockLogic'
import { props, curry } from 'ramda'

const BlockChainLogic = () => ({
  newBlockChain: genesis =>
    BlockChain(
      genesis || BlockLogic.createGenesisBlock({ data: 'Genesis Block' })
    ),

  appendBlock: curry((blockchain, newBlock) => {
    return blockchain.append({
      previousHash: blockchain.last().hash,
      hash: BlockLogic.calculateHash(
        props(['index', 'timestamp', 'data', 'previousHash'], newBlock)
      ),
      ...newBlock
    })
  })
})

export default BlockChainLogic
