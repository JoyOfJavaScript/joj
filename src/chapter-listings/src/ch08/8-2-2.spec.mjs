import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.js'
const { assert } = chai

describe('8.2.2 - Are promises algebraic?', () => {
  it('Shows promise in pending status', async () => {
    const p = new Promise(resolve => {
      setTimeout(() => {
        console.log('Done')
        resolve()
      }, 3000)
    })
    assert.ok(makeQueryablePromise(p).isPending())
  })

  const unique = letters => Array.from(new Set(letters))
  const join = arr => arr.join('')
  const toUpper = str => str.toUpperCase()
  const identity = x => x

  it('Shows identity', async () => {
    const resultA = await Promise.resolve('aa').then(identity)
    const resultB = await Promise.resolve('aa')
    assert.equal(resultA, resultB, 'aa')
  })

  it('Shows composition', async () => {
    const resultA = await Promise.resolve('aabbcc')
      .then(unique)
      .then(join)
      .then(toUpper)

    const resultB = await Promise.resolve('aabbcc')
      .then(compose(
        toUpper,
        join,
        unique)
      )
    assert.equal(resultA, resultB, 'ABC')
  })

  it('Shows chaining', async () => {
    const result = await Promise.resolve('aa')
      .then(value => {
        return `${value}bb` // #A
      })
      .then(value => {
        return Promise.resolve(`${value}cc`) // #B
      })

    assert.equal(result, 'aabbcc')
  })
})


function makeQueryablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise;

  // Set initial state
  let isPending = true;
  let isRejected = false;
  let isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  const result = promise.then(
    function (v) {
      isFulfilled = true;
      isPending = false;
      return v;
    },
    function (e) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isFulfilled = function () { return isFulfilled; };
  result.isPending = function () { return isPending; };
  result.isRejected = function () { return isRejected; };
  return result;
}