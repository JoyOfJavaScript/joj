import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import { map } from './rx.mjs'

const { assert } = chai

describe('9.4.4 - Building your own reactive toolkit', () => {
  it('Map', done => {
    let result = 0;

    const square = num => num ** 2

    map(square, Observable.of(1, 2, 3))
      .subscribe({
        next(randomNumber) {
          result += randomNumber  // 1 + 4 + 9 = 14
        },
        complete() {
          console.log('Observable with standalone operators: ', result)
          assert.equal(result, 14)
          done()
        }
      })
  })
  it('Composing map', done => {
    let result = 0;
    const square = num => num ** 2
    const add = curry((x, y) => x + y)
    const subs = map(square, map(add(1), Observable.of(1, 2, 3)))
      .subscribe({
        next(number) {
          result += number  // 4 + 9 + 16 = 29
        },
        complete() {
          console.log('Observable with composed, standalone operators: ', result)
          assert.equal(result, 29)
          done()
        }
      })
    subs.unsubscribe()
  })
})