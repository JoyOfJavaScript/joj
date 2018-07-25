import DataBlock from './DataBlock'
import Pair from '@joj/adt/pair'

// Alternate solution: http://2ality.com/2013/03/subclassing-builtins-es6.html

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
class Blockchain extends Array {
  constructor () {
    super()
  }

  static init () {
    const blockchain = Blockchain.of(DataBlock.genesis())
    blockchain.pendingTransactions = []
    return blockchain
  }

  /**
   * Returns Genesis (first block) in the chain
   * @return {DataBlock} First block
   */
  genesis () {
    return this[0]
  }

  last () {
    return this[this.length - 1]
  }

  split (predA, predB) {
    return Pair(Array, Array)(this.filter(predA), this.filter(predB))
  }
}
export default Blockchain
