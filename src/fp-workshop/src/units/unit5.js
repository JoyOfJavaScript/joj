/**
 * Unit 5 Applicative
 *
 * @author Luis Atencio
 */
import { Maybe, Validation, Combinators } from '../adt'
const { Success, Failure } = Validation
console.log('-------Beginning of unit 5-------')

const { curry } = Combinators

//
// MAYBE
//
const splitOn = curry((separator, str) => str.split(separator || /\s/))

const breakSentence = sentence =>
  Maybe.of(splitOn(/\s/)).ap(Maybe.fromNullable(sentence))

console.log('Break "Hello World"', breakSentence('Hello World').toString())
console.log('Break "Hello World"', breakSentence(null).toString())

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

console.log('is Failure?', v.isFailure())
console.log('Validation message: ', v.toString())

console.log('-------End of unit 5-------')
