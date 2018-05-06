/**
 * Unit 2 Function Composition
 *
 * @author Luis Atencio
 */
import { print } from './util'
console.log('--------------Beginning of unit 2--------------')

//
// COMPOSE 2
//
const compose2 = (f, g) => x => f(g(x))
const toChars = Array.from
const count = arr => (!arr ? 0 : arr.length)

const countLetters = compose2(count, toChars)
print('Letters in uxdevsummit:', countLetters('uxdevsummit'))

//
// COMPOSE 3
//
const compose3 = (f, g, h) => x => f(g(h(x)))
const padStr = s => s.padStart(2)
const map = f => arr => arr.map(f)
const toUpper = str => str.toUpperCase()

const formatString = compose3(map(toUpper), map(padStr), Array.from)
print(...formatString('uxdevsummit'))

//
// COMPOSE N
//
import { Combinators } from '../adt'
const { compose } = Combinators

//
// Exercise 2 Count the number of words using this input variable
//
const input = 'The quick brown fox jumps over the lazy dog'
const tokenize = str => str.split(/\s/)
const countWords = compose(count, tokenize)
print('Number of words', countWords(input))

const countRec = ([a, ...tail]) => (!a ? 0 : 1 + countRec(tail))
const countWords2 = compose(countRec, tokenize)
print(
  'Number of words',
  countWords2('The quick brown fox jumps over the lazy dog')
)

console.log('--------------End of unit 2--------------')
