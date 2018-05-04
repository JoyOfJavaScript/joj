/**
 * Unit 3 Currying
 *
 * @author Luis Atencio
 */
console.log('-------Beginning of unit 3-------')

// Format constants
const UNDERSCORE = '\x1b[4m'
const RESET = '\x1b[0m'

// Color constants
const CYAN = '\x1b[36m'
const YELLOW = '\x1b[33m'

//
// CURRY 2
//
const curry2 = f => a => b => f(a, b)
const raise = curry2((b, e) => b ** e)
const raiseTwo = raise(2)
console.log('Raise two to...', raiseTwo)
console.log('Raise two to the third.', raiseTwo(3))

//
// CURRY N
//
import { Combinators } from '../adt'
const { curry } = Combinators

console.log('-------End of unit 3-------')
