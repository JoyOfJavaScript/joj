import https from 'https'

console.log('-------Beginning Last Unit-------')
import { Combinators, Maybe, Validation } from '../adt'
const { Success, Failure } = Validation
const { Just, Nothing } = Maybe
const { compose, curry, flatMap, map, fold } = Combinators

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

const printSafeTitle = compose(
  then(console.log),
  then(
    compose(
      fold,
      map(prop('title')),
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

printSafeTitle(
  'https://www.googleapis.com/books/v1/volumes?q=isbn:0747532699'
).then(() => console.log('-------THANKS!!!-------'))
