import chai from 'chai'
import reactivize from './reactivize.mjs'

const { assert } = chai

describe('9.4.9 - Dynamic steamification', () => {
  it('Creates a Reactive Array', done => {
    const square = num => {
      console.log('Squaring:', num)
      return num ** 2
    }
    const isEven = num => {
      console.log('Is even:', num)
      return num % 2 === 0
    }
    let count = 0
    const arr$ = reactivize([1, 2, 3, 4, 5])
    const subs = Observable.from(arr$)
      .filter(isEven)
      .map(square)
      .subscribe({
        next(value) {
          console.log('Received new value', value)
          count += value
        }
      })

    assert.equal(count, 20)
    arr$.push(6)
    assert.equal(count, 56)
    subs.unsubscribe()
    done()
  }).timeout(10_000)
})