/**
 * Provides flatMap/chain/bind extension
 *
 * @see https://github.com/fantasyland/fantasy-land#monad
 * @return {Object} Object
 */
const Monad = {
  flatMap(f) {
    return this.map(f).get()
  },
  chain(f) {
    //#B
    return this.flatMap(f)
  },
  bind(f) {
    //#B
    return this.flatMap(f)
  }
}

export default Monad
