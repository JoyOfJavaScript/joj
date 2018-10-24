if (typeof Object.mixin !== 'function') {
  // Must be:
  // - writable: true
  // - enumerable: false
  // - configurable: true
  Object.defineProperty(Object, 'mixin', {
    value: function concatExtend (descriptor, ...mixins) {
      let base = Object(descriptor)
      if (isDescriptor(descriptor)) {
        base = { ...base.state, ...base.methods, ...base.interop }
      }

      if (!Object.isExtensible(base)) {
        throw new TypeError(
          'Unable to concatenate mixins into base object. Object is not extensible'
        )
      }
      // Check if base object is intended to be used as prototype
      const to = Object.getOwnPropertySymbols(base).includes(Symbol.for('base'))
        ? // Link prototype
          Object.create(base)
        : // Create copy of object
          { ...base }

      // Mixin object delegates
      // return Object.assign(to, mixins.reduce((a, b) => ({ ...a, ...b }), {}))
      return Object.assign(to, ...mixins)
    },
    writable: false,
    configurable: false
  })
}

function isDescriptor (obj) {
  return obj && (obj['state'] || obj['methods'])
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
