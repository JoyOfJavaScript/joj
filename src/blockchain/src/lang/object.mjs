if (typeof Object.impl !== 'function') {
  // Must be:
  // - writable: false
  // - enumerable: false
  // - configurable: false
  Object.defineProperty(Object, 'impl', {
    value: (...mixins) => target => {
      if (!Object.isExtensible(target) || Object.isSealed(target)) {
        throw new TypeError(
          'Unable to concatenate mixins into base object. Object is either not extensible or has been sealed'
        )
      }
      // Mixin object delegates
      // return Object.assign(to, mixins.reduce((a, b) => ({ ...a, ...b }), {}))
      Object.assign(target.prototype, ...mixins)
      return target
    },
    enumerable: false,
    writable: false,
    configurable: false
  })
}

if (typeof Object.mixin !== 'function') {
  // Must be:
  // - writable: false
  // - enumerable: false
  // - configurable: false
  Object.defineProperty(Object, 'mixin', {
    value: function concatExtend(descriptor, ...mixins) {
      let base = Object(descriptor)
      if (isDescriptor(descriptor)) {
        base = { ...base.state, ...base.methods, ...base.interop }
      }

      detectCollision(base, ...mixins)

      if (!Object.isExtensible(base) || Object.isSealed(base)) {
        throw new TypeError(
          'Unable to concatenate mixins into base object. Object is either not extensible or has been sealed'
        )
      }
      // Mixin object delegates
      // return Object.assign(to, mixins.reduce((a, b) => ({ ...a, ...b }), {}))
      return Object.assign({ ...base }, ...mixins)
    },
    enumerable: false,
    writable: false,
    configurable: false
  })
}

const detectCollision = (...descriptors) =>
  descriptors
    .flatMap(Object.keys)
    .reduce(sortReducer, [])
    .reduce(collisionReducer, [])
    .forEach(c => console.log(`[WARN] Collission found: ${c}`))

const sortReducer = (accumulator, value) => {
  const nextIndex = accumulator.findIndex(i => value < i)
  const index = nextIndex > -1 ? nextIndex : accumulator.length
  accumulator.splice(index, 0, value)
  return accumulator
}

const collisionReducer = (accumulator, value, index, arr) =>
  value === arr[index + 1] ? [...accumulator, value] : accumulator

function isDescriptor(obj) {
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
