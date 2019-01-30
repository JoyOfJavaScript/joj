import Applicative from './Applicative'
import Functor from './Functor'
import Monad from './Monad'

const contractMap = new Map([
  ['ap', Applicative],
  ['map', Functor],
  ['flatMap', Monad]
])

export function decorate (adt) {
  return adt[Symbol.for('implements')].reduce(
    (t, c) => Object.assign(t, contractMap.get(c).call(adt)),
    adt
  )
}

export { Functor }
export { Applicative }
export { Monad }
