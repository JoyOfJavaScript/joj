import EventEmitter from 'events'
import { Readable } from 'stream'
import chai from 'chai'

const { assert } = chai

describe('9.3.2 - Implementing a strea-able array', () => {
  it('PushArray example', done => {
    class PushArray extends Array {

      static EVENT_NAME = 'new_value'

      #eventEmitter = new EventEmitter();

      constructor(...values) {
        super(...values)
      }

      push(value) {
        this.#eventEmitter.emit(PushArray.EVENT_NAME, value)
        return super.push(value)
      }

      subscribe({ next }) {
        this.#eventEmitter.on(PushArray.EVENT_NAME, value => {
          next(value)
        })
      }

      unsubscribe() {
        this.#eventEmitter.removeAllListeners(PushArray.EVENT_NAME)
      }

      async *[Symbol.asyncIterator]() {

        this.unsubscribe()
        for (const value of this) {
          yield value
        }
        while (true) {
          if (this.#eventEmitter.listenerCount(this.constructor.EVENT_NAME) === 0) {  //     Uncaught Error: Class "PushArray" cannot be referenced in computed property keys.
    break
  }
  yield new Promise(resolve => {
    this.#eventEmitter.once(this.constructor.EVENT_NAME, resolve)
  })
}
      }
  }

const arr = new PushArray(1, 2, 3)
assert.deepEqual([1, 4, 9], arr.map(x => x ** 2))
arr.subscribe({  // If I do this, I will have to unsubscribe in asyncIterator
  next(value) {
    assert.equal(value, 4)
  }
})
arr.push(4)
assert.deepEqual([1, 2, 3, 4], arr)

const vals = []
Readable
  .from(arr)
  .on('data', value => {
    vals.push(value)
  })
  .on('end', () => {
    assert.deepEqual([1, 2, 3, 4], vals)
    arr.unsubscribe()
    arr.push(5)
    assert.deepEqual([1, 2, 3, 4, 5], arr)
    done()
  })
}).timeout(10_000)  
})