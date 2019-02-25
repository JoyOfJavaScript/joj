import { implementsContract } from './shared'

/**
 * Provides flatMap/chain/bind extension
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */
const isMonad = implementsContract('ap', 'map', 'flatMap', 'bind', 'chain')
const Monad = () => ({
  flatMap (f) {
    if (isMonad(this)) {
      return f.call(this, this.value) // Removes extra wrapping layer
    } else {
      return this
    }
  },
  chain (f) {
    return this.flatMap(f)
  },
  bind (f) {
    return this.flatMap(f)
  }
})

export default Monad
