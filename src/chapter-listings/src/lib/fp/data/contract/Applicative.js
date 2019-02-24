import { implementsContract } from './shared'
import { isFunction } from '../../combinators'

/**
 * Provides apply extension
 *
 *
 * @see https://github.com/fantasyland/fantasy-land#functor
 * @return {Object} Object
 */
const Applicative = () => ({
  ap (App) {
    if (implementsContract(this, 'ap', 'map')) {
      if (isFunction(this.value)) {
        return this.constructor.of(this.value.call(this, App.value))
      } else {
        throw new Error(`Value wrapped inside applicative must be a function`)
      }
    } else {
      return this
    }
  }
})

export default Applicative
