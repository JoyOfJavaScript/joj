/**
 * Unit 8 Dealing with effects
 *
 * @author Luis Atencio
 */

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
    then(print('Safe property')),
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
printSafeTitle(`${API}?q=isbn:0747532699`)
printSafeAuthors(`${API}?q=isbn:0747532699`)
