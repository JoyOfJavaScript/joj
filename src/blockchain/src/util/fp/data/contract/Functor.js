import { getSpeciesConstructor } from './shared.js'

/**
 * Provides functor extension
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */

const Functor = (shortCircuit = false) => ({
  map(f = x => x) {
    if (!shortCircuit) {
      const C = getSpeciesConstructor(this)
      return C.of(f(this.get()))
    } else {
      return this
    }
  }
})

export default Functor
