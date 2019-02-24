import { implementsContract } from './shared'

/**
 * Provides functor extension
 *
 * map :: Functor f => f a ~> (a -> b) -> f b
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */
const Functor = () => ({
  map (f) {
    if (implementsContract(this, 'map')) {
      return this.constructor.of(f(this.value))
    } else {
      return this
    }
  }
})

export default Functor
