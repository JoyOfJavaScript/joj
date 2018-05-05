import { Combinators } from '../adt'
const { curry } = Combinators

export const print = curry((msg, value) => {
  if (value['@@implements'] && value['@@implements'].includes('flatMap')) {
    console.log('%s\x1b[36m%s\x1b[0m', `${msg}:`.padEnd(50), value.toString())
  } else {
    console.log(`%s\x1b[36m%s\x1b[0m`, `${msg}:`.padEnd(50), value)
  }
})
