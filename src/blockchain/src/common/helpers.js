import Pair from '@joj/adt/pair'

/**
 * Freeze an object (making it immutable) as well as any nested object
 * in this object's graph
 * @param {Object}  obj Object to freeze
 * @return {Object} Returns back same object with its attributes (writable) augmented
 */
export const deepFreeze = obj => {
  if (!Object.isFrozen(obj)) {
    // ES2015, we don't have to check whether attribute is object
    Object.keys(obj).forEach(name => deepFreeze(obj[name]))
    Object.freeze(obj)
  }
  return obj
}

// Insert polyfill
Object.deepFreeze = Object.deepFreeze || deepFreeze

if (!Array.prototype.split) {

  /**
   * Splits the chain using two predicate functions
   * @param {Function} predA First split criteria
   * @param {Function} predB Second split criteria
   * @return {Pair} Split arrays
   */
  Array.prototype.split = function(predA, predB) {
    return Pair(Array, Array)(this.filter(predA), this.filter(predB))
  }
}
