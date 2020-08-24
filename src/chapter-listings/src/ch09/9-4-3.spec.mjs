import chai from 'chai'

const { assert } = chai
import { filter, map, reduce, skip } from './rx.mjs'

describe('9.4.3 - Creating custom observables', () => {
  it('Random number stream', done => {
    function newRandom(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    }
    const randomNum$ = new Observable(observer => {
      const _id = setInterval(() => {
        observer.next(newRandom(1, 10));
      }, 100)

      return () => {
        clearInterval(_id)
      }
    })
    const subs = randomNum$
      .subscribe({
        next(number) {
          assert.isOk(Number.isFinite(number))
          assert.isOk(number > 0)
        },
        complete() {
          console.log('Stream ended')
        }
      })

    subs.unsubscribe() //#D
    done()
  })

  it('Combining map, filter, reduce, skip', done => {
    const square = num => num ** 2
    const isEven = num => num % 2 === 0
    const add = (x, y) => x + y

    reduce(add, 0,
      map(square,
        filter(isEven,
          skip(1, Observable.of(1, 2, 3, 4)))))
      .subscribe({
        next(value) {
          assert.equal(value, 20);
        },
        complete() {
          done();
        }
      });
  })
})