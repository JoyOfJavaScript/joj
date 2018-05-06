/**
 * Unit 3 Currying
 *
 * @author Luis Atencio
 */
import { print } from './util'
console.log('--------------Beginning of unit 3--------------')

//
// CURRY 2
//
const curry2 = f => a => b => f(a, b)
const raise = curry2((b, e) => b ** e)
const raiseTwo = raise(2)
print('Raise two to...', raiseTwo)
print('Raise two to the third.', raiseTwo(3))

//
// CURRY N
//
import { Combinators } from '../adt'
const { curry } = Combinators

//
// Exercise 3 Build a simple curried logger function that accepts 3 parameters: format, level, and message
//            The format should be either 'plain' or 'json' so that the log appears in said format
//            Use this curried function to derive  'info' and 'error' logger functions from it.
//
const logger = curry((format, level, message) => {
  if (format === 'json') {
    console.log(
      JSON.stringify({
        date: new Date(),
        level,
        message,
      })
    )
  } else {
    console.log(`${new Date()} [%s] -> %s`, level, message)
  }
})

const info = logger('plain', 'INFO')
const error = logger('json', 'ERROR')

info('Closing database connections')
error('Error opening file!')

console.log('--------------End of unit 3--------------')
