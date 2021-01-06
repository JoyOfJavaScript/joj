import chai from 'chai'

const { assert } = chai

describe('9.4.8 - Streamifying objects', () => {
  it('Make Pair streamable', done => {
    const Pair = (left, right) => ({
      left,
      right,
      [Symbol.observable]() {
        return new Observable(observer => {
          observer.next(left)
          observer.next(right)
          observer.complete()
        })
      }
    })

    Observable.from(Pair(20, 30))
      .subscribe({
        next(value) {
          assert.isOk(value === 20 || value === 30)
          console.log('Pair element: ', value)
        },
        complete() {
          done()
        }
      })
  })

  it('Listing 9.7 Streaming blocks in a blockchain', () => {
    // Tested in the blockchain project Seee: @joj/blockchain/domain/Blockchain.spec.js
  })
})