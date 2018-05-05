/**
 * Unit 4 Functors
 *
 * @author Luis Atencio
 */
import { print } from './util'
import { Combinators, Maybe, Validation } from '../adt'
const { compose, curry } = Combinators

console.log('--------------Beginning of unit 4--------------')

Function.prototype.map = function(f) {
  return compose(this, f)
}

const add = curry((a, b) => a + b)
const square = a => a ** 2
const toUpper = str => str.toUpperCase()
//
// Function types as mappable entities under composition
//
const increment = add(1)
const squareInc = increment.map(square)
print('Square and increment 2', squareInc(2))

//
// Containers
//
// Lists are functors too
const result1 = Array.of(10)
  .map(square)
  .reduce(x => x)
print('Array of 10 map square', result1)

//
// Boxing
//
const Box = a => ({
  map: (f = x => x) => Box(f(a)),
  fold: () => a,
  toString: `Box (${a})`,
})
const result2 = Box(10)
  .map(square)
  .fold()
print('Box of 10 map square', result2)

const count = arr => arr.length
const result3 = Box([1, 2, 3])
  .map(count)
  .fold()
print('Box of [1,2,3] map count', result3)

//
// MAYBE FUNCTOR
//
print('Using Maybe(10)', Maybe.fromNullable(10).map(square))
print('Using Maybe(null)', Maybe.fromNullable(null).map(square))

//
// Exercise 4 Use Validation functor to write a function called isEmpty that is to return a
// Validation.Success if the provided string is not empty; Validation.Failure otherwise
//
const isEmpty = str =>
  str && str.length > 0
    ? Validation.Success(str)
    : Validation.Failure(['String is empty'])

print('Exercise 4 answer: Validation(Hello)', isEmpty('Hello').map(toUpper))
print('Exercise 4 answer: Using Validation(Hello)', isEmpty(null).map(toUpper))

console.log('--------------End of unit 4--------------')
