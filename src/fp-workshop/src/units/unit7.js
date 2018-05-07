/**
 * Unit 7 Natural Transformations
 *
 * @author Luis Atencio
 */

import { print } from './util'
import { Maybe, Validation } from '../adt'
const { Success, Failure } = Validation

console.log('--------------Beginning of unit 7--------------')
const square = a => a ** 2

//
// ARRAY => MAYBE
// safeHead will retrieve the first element of an array if it exists (Just);
// otherwise, it returns Nothing
//
const safeHead = ([h]) => Maybe.fromNullable(h)
print('Head of [1,2,3]', safeHead([1, 2, 3]).merge())
print('Is head of empty array nothing?', safeHead([]).isNothing())

//
// NATURAL TRANSFORMATION LAW
//
// nt(x).map(f) == nt(x.map(f))

print('Left site ', safeHead([1, 2, 3]).map(square))
print('Right side', safeHead([1, 2, 3].map(square)))

//
// MAYBE => VALIDATION
//
const notEmpty = str =>
  str && str.length > 0 ? Success(str) : Failure(['String is empty'])

const emptyVal = Validation.of('')
  .flatMap(notEmpty)
  .toMaybe()
  .merge()

const emptyVal1 = Maybe.fromNullable('')
  .toValidation()
  .flatMap(notEmpty)
  .merge()

print('Empty test 1', emptyVal)
print('Empty test 2', emptyVal1)

const nullVal = Maybe.fromNullable(null)
  .toValidation()
  .flatMap(notEmpty)
  .merge()

print('Prints a null validation message', nullVal)

//
// Exercise 7 Validate an argument is not null nor empty
//
// Use ADTs Maybe and Validation to implement parameter validation
// in a functional manner.
//
// Hint: Use applicatives
//

const validateArg = arg =>
  Validation.of(x => x => x)
    .ap(Maybe.fromNullable(arg).toValidation())
    .ap(notEmpty(arg))

print('Prints validation messages', validateArg(null).merge())
print('Print default value', validateArg(null).getOrElse('other'))

console.log('--------------End of unit 7--------------')
