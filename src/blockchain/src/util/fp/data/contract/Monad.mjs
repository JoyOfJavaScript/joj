import { implementsContract } from './shared.mjs'

/**
 * Provides flatMap/chain/bind extension
 *
 * @see https://github.com/fantasyland/fantasy-land#monad
 * @return {Object} Object
 */
const Monad = (shortCircuit = false) => ({
  flatMap(f) {
    if (!shortCircuit) {
      return this.map(f).get()
    } else {
      return this
    }
  },
  chain(f) {
    //#B
    return this.flatMap(f)
  },
  bind(f) {
    //#B
    return this.flatMap(f)
  }
})

export default Monad
