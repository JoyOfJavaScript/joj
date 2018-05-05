/**
 * Unit 4 Functors
 *
 * @author Luis Atencio
 */
import { print } from './util'
import { Combinators } from '../adt'
const { compose, curry } = Combinators

console.log('-------Beginning of unit 4-------')

Function.prototype.map = function(f) {
  return compose(this, f)
}

const add = curry((a, b) => a + b)
const square = a => a ** 2

//
// Function types as mappable entities under composition
//
const increment = add(1)
const squareInc = increment.map(square)
print('Square and increment 2', squareInc(2))

//
// Containers
//

console.log('-------End of unit 4-------')
