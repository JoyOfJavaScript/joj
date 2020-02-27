import { getSpeciesConstructor } from './shared.js'
import { isFunction } from '../../combinators.js'

/**
 * Provides apply extension
 *
 * @see https://github.com/fantasyland/fantasy-land#applicative
 * @return {Object} Object
 */
const Applicative = (shortCircuit = false) => ({
  ap(App) {
    if (!shortCircuit) {
      if (isFunction(this.get())) {
        const C = getSpeciesConstructor(this)
        return C.of(this.get().call(this, App.get()))
      } else {
        throw new Error(`Value wrapped inside applicative must be a function`)
      }
    } else {
      return this
    }
  }
})

export default Applicative
