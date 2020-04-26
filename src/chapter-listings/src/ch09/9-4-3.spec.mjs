import chai from 'chai'

const { assert } = chai

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
})