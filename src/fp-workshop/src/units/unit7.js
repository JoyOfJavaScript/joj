/**
 * Unit 7 Natural Transformations
 *
 * @author Luis Atencio
 */
import https from 'https'

console.log('-------Beginning of unit 7-------')
import { Combinators, Maybe, Validation } from '../adt'
const { Success, Failure } = Validation
const { Just, Nothing } = Maybe
const { compose, curry } = Combinators

const safeHead = ([h]) => Maybe.fromNullable(h)
console.log('Head of [1,2,3]', safeHead([1, 2, 3]).merge())
console.log('Is head of empty array nothing?', safeHead([]).isNothing())

console.log('-------End of unit 7-------')

fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:0747532699')

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const data = []
      res.on('data', chunk => {
        data.push(chunk)
      })
      res.on('end', function() {
        const json = JSON.parse(data.join(''))
        resolve(json)
      })
      res.on('error', err => reject(new Error(err)))
    })
  })
}
