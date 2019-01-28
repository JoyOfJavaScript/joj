import { implementsContract } from './shared'

/**
 * Provides functor extension
 *
 * map :: Functor f => f a ~> (a -> b) -> f b
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 */
const Functor = () => ({
  map (f) {
    if (implementsContract('map', this)) {
      return this.constructor.of(f(this.unsafeGet()))
    } else {
      return this
    }
  }
})

export default Functor
