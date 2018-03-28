// Problem of reuse arises when trying to reuse pending transactions both
// in block and in blockchain
class Blockchain extends Array {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
  static get [Symbol.species]() {
    return Array
  }
}
