import { getSpeciesConstructor } from './shared'

/**
 * Provides functor extension
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */

const Functor = (shortCircuit = false) => ({
  map(f) {
    if (!shortCircuit) {
      const C = getSpeciesConstructor(this)
      return C.of(f(this.get()))
    } else {
      return this
    }
  }
})

export default Functor
