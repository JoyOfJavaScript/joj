import Validation from '@joj/blockchain/util/fp/data/validation2/validation.js'
import chai from 'chai'

const { assert } = chai

describe('9.2 - Generators', () => {
  it('Generator is a simple function', () => {
    function* sayIt() {
      return 'The Joy of JavaScript!'
    }
    assert.equal(sayIt().next().value, 'The Joy of JavaScript!')
    assert.isOk(sayIt().next().done)
  })

  it('Generator can also be a simple method', () => {
    const obj = {
      * sayIt() {
        return 'The Joy of JavaScript!'
      }
    }
    assert.equal(obj.sayIt().next().value, 'The Joy of JavaScript!')
    assert.isOk(obj.sayIt().next().done)
  })

  it('Generator yields words', () => {
    function* sayIt() {
      yield 'The'
      yield 'Joy'
      yield 'of'
      yield 'JavaScript!'
    }

    const it = sayIt()
    assert.equal(it.next().value, 'The') // { value: 'The', done: false }
    assert.equal(it.next().value, 'Joy') // { value: 'Joy', done: false } 
    assert.isNotOk(it.next().done)

    for (const message of sayIt()) {
      console.log(message)
    }
  })

  it('[Symbol.iterator] with Pair', () => {
    const Pair = (left, right) => ({
      left,
      right,
      [Symbol.iterator]: function* () {
        yield left
        yield right
      }
    })
    const dimensions = Pair(20, 30)
    const [left, right] = dimensions
    assert.equal(left, 20)
    assert.equal(right, 30)
  })

  it('[Symbol.iterator] with Validation', () => {
    const [, right] = Validation.Success(2) //#A

    assert.isOk(right.isSuccess)
    assert.equal(right.get(), 2)

    const [left,] = Validation.Failure(new Error('Error occurred!')) //#B

    assert.isOk(left.isFailure)
    assert.equal(left.getOrElse(5), 5)
  })

  it('[Symbol.iterator] with Validation and default', () => {
    const isNotEmpty = val => val !== null && val !== undefined ? Validation.Success(val) : Validation.Failure('Value is empty')
    const [left, right = Validation.Success('default')] = isNotEmpty(null)
    assert.isOk(left.isFailure)
    assert.equal(right.get(), 'default')
  })
})