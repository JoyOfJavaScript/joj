/**
 * Unit 8 Dealing with effects
 *
 * @author Luis Atencio
 */

import Rx from 'rxjs'
import https from 'https'
import { print } from './util'
import { Combinators, Maybe } from '../adt'
const { compose, curry, flatMap, map, fold } = Combinators

console.log('--------------Last unit--------------')

// Google Books API
const API = 'https://www.googleapis.com/books/v1/volumes'

/**
 * Fetch data from any URL and return a promise
 *
 * @param {String} url URL to fetch data from
 * @return {Promise}   JSON response wrapped in a promise
 */
const fetch = url =>
  new Promise((resolve, reject) => {
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

const safeHead = ([h]) => Maybe.fromNullable(h)
const then = curry((f, P) => P.then(f))
const prop = curry((name, obj) => obj[name])
const orElse = curry((msg, maybe) => maybe.getOrElse(msg))

const printSafeProperty = name =>
  compose(
    // Print the information found
    then(print('Safe property')),
    then(
      compose(
        // Print message if any of this fails
        orElse('Book property not found'),
        // Extract name of property of interest (title | author)
        map(prop(name)),
        // Extract the volumeInfo
        map(prop('volumeInfo')),
        // Safe read first element
        flatMap(safeHead),
        // Extract the items property
        map(prop('items'))
      )
    ),
    // Wrap the result of the promise
    then(Maybe.fromNullable),
    // Fold the promise
    fold,
    // Fetch data
    map(fetch),
    // Lift input to function into Maybe
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
printSafeTitle(`${API}?q=isbn:0747532699`)
printSafeAuthors(`${API}?q=isbn:0747532699`)

//
// OBSERVABLES
//
Rx.Observable.from(fetch(`${API}?q=isbn:0747532699`))
  .map(
    compose(
      // Extract name of property of interest (title | author)
      map(prop('title')),
      // Extract the volumeInfo
      map(prop('volumeInfo')),
      // Safe read first element
      flatMap(safeHead),
      // Extract the items property
      map(prop('items'))
    )
  )
  .subscribe(
    value => print('Value from Observable', value),
    error => print(`[ERROR] Error thrown`, error.message),
    () => print('Done!')
  )
