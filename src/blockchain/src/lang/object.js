if (typeof Object.concat !== 'function') {
  // Must be:
  // - writable: true
  // - enumerable: false
  // - configurable: true
  Object.defineProperty(Object, 'concat', {
    value: function concatExtend (base, ...mixins) {
      // Check if base object is intended to be used as prototype
      const to = Object.getOwnPropertySymbols(Object(base)).includes(
        Symbol.for('base')
      )
        ? // Link prototype
          Object.create(Object(base))
        : // Create copy of object
          { ...Object(base) }

      // Mixin object delegates
      return Object.assign(to, mixins.reduce((a, b) => ({ ...a, ...b }), {}))
    },
    writable: true,
    configurable: true
  })
}

/**
   * Freeze an object (making it immutable) as well as any nested properties
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

export default {
  deepFreeze
}
