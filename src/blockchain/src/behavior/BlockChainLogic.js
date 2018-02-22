import BlockChain from '../data/Blockchain'
import Block from '../data/Block'
import BlockLogic from './BlockLogic'
import { props, curry } from 'ramda'

const appendBlock = curry((blockchain, newBlock) => {
  // TODO: Fix here to add but retrn blockchan with added data
  return blockchain.add({
    previousHash: blockchain.last().hash,
    hash: Block.calculateHash(
      props(['index', 'timestamp', 'data', 'previousHash'], newBlock)
    ),
    ...newBlock
  })
})

/**
 * Exported BlockChainLogic interface
 */
const BlockChainLogic = {
  appendBlock
}

export default BlockChainLogic
