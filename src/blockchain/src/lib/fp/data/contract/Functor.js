import { implementsContract } from './shared'

/**
 * Provides functor extension
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */

const isFunctor = implementsContract('map')

const Functor = () => ({
  map (f) {
    if (isFunctor(this)) {
      return this.constructor.of(f(this.value))
    } else {
      return this
    }
  }
})

export default Functor
