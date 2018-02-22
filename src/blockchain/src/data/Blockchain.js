import Block from './Block'
import { identity } from 'ramda'

const Blockchain = chain => {
  // Private space
  const _data = chain || Array.of(Block.genesis())

  // Public interface
  return {
    // Returns first ever block created
    genesis: () => _data[0],
    // Returns last (or latest) block
    last: () => _data[_data.length - 1],
    // Appends the new block to the end of the chain
    append: block => _data.concat(block),
    // Inject another block chain data
    flatMap: () => null,
    // Get all blocks
    blocks: () => _data.map(identity)
  }
}

export default Blockchain
