import DataBlock from './DataBlock'
import HasBlocks from '../data/traits/HasBlocks'

//Alternate solution: http://2ality.com/2013/03/subclassing-builtins-es6.html

/**
 * Untamperable block chain. You may initialize the chain with an existing
 * chain. But the most common thing to do is initialize with an empty Chain
 * and allow itself to bootstrap with a Genesis block.
 *
 * @param {Array} chain Chain to initialize blockchain with
 * @return {Blockchain} Returns a blockchain object
 */
// Talk about species and the species pattern
// http://exploringjs.com/es6/ch_classes.html#sec_species-pattern

const Blockchain = (...blocks) => {
  const _state = {
    blocks
  }
  return Object.assign({}, HasBlocks(_state))
}

Blockchain.init = () => {
  const blockchain = Blockchain(DataBlock.genesis())
  blockchain.pendingTransactions = []
  return blockchain
}

export default Blockchain
