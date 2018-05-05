/**
 * Unit 7 Natural Transformations
 *
 * @author Luis Atencio
 */
console.log('-------Beginning of unit 7-------')
import { Maybe, Validation } from '../adt'
const { Success, Failure } = Validation

//
// ARRAY => MAYBE
// safeHead will retrieve the first element of an array if it exists (Just);
// otherwise, it returns Nothing
//
const safeHead = ([h]) => Maybe.fromNullable(h)
console.log('Head of [1,2,3]', safeHead([1, 2, 3]).merge())
console.log('Is head of empty array nothing?', safeHead([]).isNothing())

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

console.log('Empty test 1', emptyVal)
console.log('Empty test 2', emptyVal1)

const nullVal = Maybe.fromNullable(null)
  .toValidation()
  .flatMap(notEmpty)
  .merge()

console.log('Prints a null validation message', nullVal)

//
// Exercise 7.1 Validate an argument is not null nor empty
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

console.log('Prints validation messages', validateArg(null).merge())
console.log('Print default value', validateArg(null).getOrElse('other'))

console.log('-------End of unit 7-------')
