import Block from './Block'
import { identity } from 'ramda'

const Blockchain = chain => {
  // Private space
  const _data = chain || Array.of(Block.genesis())
  let _size = 0

  // Public interface
  return {
    // Returns first ever block created
    genesis: () => _data[0],
    // Returns last (or latest) block
    last: () => _data[_data.length - 1],
    // Appends the new block to the end of the chain, returns a new chain
    // pointing to the new structure (for efficiency you might want to use push instead of concat)
    push: block => {
      _size = _data.push(block)
    },
    // Append to block chains
    appendChain: blockchain => BlockChain(_data.concat(blockchain.blocks())),
    // Get all blocks (don't return original to caller)
    blocks: () => [..._data],
    size: () => _size
  }
}

export default Blockchain
