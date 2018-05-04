/**
 * Unit 2 Function Composition
 * @author Luis Atencio
 */
console.log('-------Beginning of unit 2-------')

// Format constants
const UNDERSCORE = '\x1b[4m'
const RESET = '\x1b[0m'

// Color constants
const CYAN = '\x1b[36m'
const YELLOW = '\x1b[33m'

//
// COMPOSE 2
//
const compose2 = (f, g) => x => f(g(x))
const toUpper = str => str.toUpperCase()
const logCyan = str => console.log(`${CYAN}%s\x1b[0m`, str)

const printCyan = compose2(logCyan, toUpper)
printCyan('uxdevsummit')

//
// COMPOSE 3
//

const compose3 = (f, g, h) => x => f(g(h(x)))

const formatString = compose3(
  ([COLOR, str]) => [`${UNDERSCORE}${COLOR}%s${RESET}`, str],
  str => [YELLOW, str],
  toUpper
)
console.log(...formatString('uxdevsummit'))

//
// COMPOSE N
//
import { Combinators } from '../adt'
const { compose } = Combinators

//
// Exercise 2.1 Count the number of words using this input variable
//
const input = 'The quick brown fox jumps over the lazy dog'
// const tokenize = str => str.split(/\s/)
// const count = arr => (!arr ? 0 : arr.length)
// const countWords = compose(count, tokenize)
//console.log('Number of words', countWords(input))

// const countRec = ([a, ...tail]) => (!a ? 0 : 1 + countRec(tail))
// const countWords2 = compose(countRec, tokenize)
// console.log(
//   'Number of words',
//   countWords2('The quick brown fox jumps over the lazy dog')
// )

console.log('-------End of unit 2-------')
