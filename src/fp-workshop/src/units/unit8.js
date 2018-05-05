import https from 'https'

console.log('-------Beginning Last Unit-------')
import { Combinators, Maybe, Validation } from '../adt'
const { Success, Failure } = Validation
const { Just, Nothing } = Maybe
const { compose, curry, flatMap, map, fold } = Combinators

const API = 'https://www.googleapis.com/books/v1/volumes'

/**
 * Fetch data from any URL and return a promise
 *
 * @param {String} url URL to fetch data from
 * @return {Promise}   JSON response wrapped in a promise
 */
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

const safeHead = ([h]) => Maybe.fromNullable(h)
const then = curry((f, P) => P.then(f))
const prop = curry((name, obj) => obj[name])
const orElse = curry((msg, maybe) => maybe.getOrElse(msg))

const printSafeProperty = name =>
  compose(
    then(console.log),
    then(
      compose(
        orElse('Book property not found'),
        map(prop(name)),
        map(prop('volumeInfo')),
        flatMap(safeHead),
        map(prop('items'))
      )
    ),
    then(Maybe.fromNullable),
    fold,
    map(fetch),
    Maybe.fromNullable
  )

/**
 * Fetches a book from the provided URL and prints the title of that book
 */
const printSafeTitle = printSafeProperty('title')

/**
 * Fetches the author of said book
 */
const printSafeAuthors = printSafeProperty('authors')
printSafeTitle(`${API}?q=isbn:0747532699`).then(() =>
  console.log('-------THANKS!!!-------')
)

printSafeAuthors(`${API}?q=isbn:0747532699`).then(() =>
  console.log('-------THANKS!!!-------')
)
