/**
 * Unit 5 Applicative
 *
 * @author Luis Atencio
 */
import { print } from './util'
import { Maybe, Validation, Combinators } from '../adt'
const { Success, Failure } = Validation
console.log('--------------Beginning of unit 5--------------')

const { curry } = Combinators

//
// VALIDATION
//
const notEmpty = str =>
  str && str.length > 0 ? Success(str) : Failure(['String is empty'])

const notExceeds = curry(
  (n, str) =>
    str.length <= n
      ? Success(str)
      : Failure([`String exceeds set length of ${n}`])
)

const startsWithNumber = str =>
  Number.isInteger(str[0])
    ? Success(str)
    : Failure(['String does not start with a number'])

const data = 'luis atencio'
const v = Validation.of(x => x => x)
  .ap(notExceeds(3, data))
  .ap(startsWithNumber(data))
  .ap(notEmpty(data))

print('is Failure?', v.isFailure())
print('Validation message: ', v.toString())

//
// Exercise 5. Use Maybe to conditionally break up a sentence given a
// certain separator string (e.g. space, a new line, etc)
//
const splitOn = curry((separator, str) => str.split(separator || /\s/))

const breakSentence = sentence =>
  Maybe.of(splitOn(/\s/)).ap(Maybe.fromNullable(sentence))

print('Break "Hello World"', breakSentence('Hello World').toString())
print('Break "Hello World"', breakSentence(null).toString())

console.log('--------------End of unit 5--------------')
