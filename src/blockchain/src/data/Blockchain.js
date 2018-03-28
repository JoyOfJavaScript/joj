import DataBlock from './DataBlock'
import '../common/helpers'

/**
 * Untamperable block chain. You may initialize the chain with an existing
 * chain. But the most common thing to do is initialize with an empty Chain
 * and allow itself to bootstrap with a Genesis block.
 *
 * @param {Array} chain Chain to initialize blockchain with
 * @return {Blockchain} Returns a blockchain object
 */
const Blockchain = chain => {
  // Private space
  const _data = chain || Array.of(DataBlock.genesis())
  let _size = 0

  // Public interface
  // Consider returning Object.assign(Array.prototype, {...})
  return {
    constructor: Blockchain,
    [Symbol.hasInstance]: i => i.constructor.name === 'Blockchain',
    [Symbol.iterator]: function*() {
      for (const b of _data) {
        yield b
      }
    },
    // Returns first ever block created
    genesis: () => _data[0],
    // Returns last (or latest) block
    last: () => _data[_data.length - 1],
    // Appends the new block to the end of the chain, returns a new chain
    // pointing to the new structure (for efficiency you might want to use push instead of concat)
    push: block => {
      _size = _data.push(Object.deepFreeze(block))
    },
    // Get all blocks (don't return original to caller)
    blocks: () => [..._data],
    // Get block at a certain position in the chain
    blockAt: index => (index >= _size ? null : _data[index]),
    // Returns size of chain
    size: () => _size
  }
}

// var SubArray = function() {
//     var arrInst = new Array(...arguments); // spread arguments object
//     /* Object.getPrototypeOf(arrInst) === Array.prototype */
//     Object.setPrototypeOf(arrInst, SubArray.prototype);     //redirectionA
//     return arrInst; // now instanceof SubArray
// };
//
// SubArray.prototype = {
//     // SubArray.prototype.constructor = SubArray;
//     constructor: SubArray,
//
//     // methods avilable for all instances of SubArray
//     add: function(element){return this.push(element);},
//     ...
// };
//
// Object.setPrototypeOf(SubArray.prototype, Array.prototype); //redirectionB
//
// var subArr = new SubArray(1, 2);
// subArr.add(3); subArr[2]; // 3

export default Blockchain
