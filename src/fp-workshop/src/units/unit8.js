/**
 * Unit 8 Dealing with effects
 *
 * @author Luis Atencio
 */
import https from 'https'
import { print } from './util'
import { Combinators, Maybe } from '../adt'
const { compose, curry, map, fold } = Combinators

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
        if (data.length > 0) {
          resolve(Maybe.Just(JSON.parse(data.join(''))))
        } else {
          resolve(Maybe.Nothing())
        }
      })
      res.on('error', err => reject(new Error(err)))
    })
  })

const safeHead = ([h]) => Maybe.fromNullable(h)
const then = curry((f, P) => P.then(f))
const prop = curry((name, obj) => obj[name])
const orElse = curry((msg, maybe) => maybe.getOrElse(msg))

const maybeToPromise = m => m.fold(a => Promise.resolve(a))

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
        // Safe read first element (second natural transformation)
        safeHead,
        // Extract the items property
        prop('items')
      )
    ),
    // Extract the maybe out from the promise (First Natural transformation)
    then(maybeToPromise),
    // Fetch data
    fold(fetch),
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
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/pluck'

const readProperty$ = curry((name, url) =>
  Observable.of(url)
    .filter(u => u && u.length > 0)
    .switchMap(u => Observable.fromPromise(fetch(u)))
    // Natural transformation
    .switchMap(maybeToPromise)
    .pluck('items')
    // Natural transformation Observable([a]) => Observable(a)
    .switchMap(Observable.from)
    // Read properties
    .pluck('volumeInfo')
    .pluck(name)
)
const readTitle$ = readProperty$('title')
readTitle$(`${API}?q=isbn:0747532699`).subscribe(
  value => print('From Observable', value),
  error => print(`[ERROR] Error thrown`, error.message),
  () => print('Done!')
)
