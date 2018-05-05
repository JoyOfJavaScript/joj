import { Combinators } from '../adt'
const { curry } = Combinators

export const print = curry((msg, value) => {
  if (value['@@implements'] && value['@@implements'].includes('flatMap')) {
    console.log('%s %s', `${msg}:`.padEnd(50), value.toString())
  } else {
    console.log(`%s %s`, `${msg}:`.padEnd(50), value)
  }
})
