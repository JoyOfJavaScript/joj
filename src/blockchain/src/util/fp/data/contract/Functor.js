import { getSpeciesConstructor } from './shared.js'

/**
 * Provides functor extension
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */

const Functor = {
  map(f = x => x) {
    const C = getSpeciesConstructor(this)
    return C.of(f(this.get()))
  }
}

export default Functor
