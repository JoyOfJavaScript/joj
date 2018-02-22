import Block from './Block'

const Blockchain = (genesis = Block()) => {
  // Private space
  const data = Array.of(genesis)

  // Public interface
  return {
    // Returns first ever block created
    genesis: () => data[0],
    // Returns last (or latest) block
    last: () => data[data.length - 1],
    // Appends the new block to the end of the chain
    append: block => data.append(block),
    // Map a function over the blocks in the chain
    map: () => null,
    // Inject another block chain data
    flatMap: () => null
  }
}

export default Blockchain
