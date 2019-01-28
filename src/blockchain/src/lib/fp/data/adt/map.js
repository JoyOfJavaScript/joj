/**
 * Provides functor extension
 *
 * map :: Functor f => f a ~> (a -> b) -> f b
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 */
const Functor = {
  map (f) {
    if (isMappable(this)) {
      return this.constructor.of(f(this.unsafeGet()))
    } else {
      return this
    }
  }
}

function isMappable (obj) {
  return obj[Symbol.for('implements')].includes('map')
}

export default Functor
