import '../src/lib/rx/reactive-extensions'
import { assert } from 'chai'

describe('Tests for Observable', () => {
  it('Tests Observable basic functionality', () => {
    const obs = new Observable(observer => {
      for (const i of [1, 2, 3]) {
        observer.next(i)
      }
    })
    obs.subscribe({
      next: number => {
        console.log('Seeing number: ', number)
        assert.isNumber(number)
      },
      error: error => {
        console.log(error.message)
      },
      complete: () => {
        console.log('Connection terminated by server!')
      }
    })
  })
})
