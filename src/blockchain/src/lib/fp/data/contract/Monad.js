import { implementsContract } from './shared'

/**
 * Provides flatMap extension
 *
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */
const Monad = () => ({
  flatMap (f) {
    if (implementsContract(this, 'ap', 'map', 'flatMap')) {
      return f.call(this, this.value)
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
