import './rx.mjs'
import chai from 'chai'

const { assert } = chai

describe('9.4.5 - Observable mixin extension', () => {
  it('Combining map, filter, reduce', done => {
    const square = num => num ** 2
    const isEven = num => num % 2 === 0
    const add = (x, y) => x + y

    Observable.of(1, 2, 3, 4)
      .skip(1)
      .filter(isEven)
      .map(square)
      .reduce(add, 0)
      .subscribe({
        next(value) {
          assert.equal(value, 20)
        },
        complete() {
          done()
        }
      })
  })
})