import Validation, { Failure, Success } from './validation.js'
import chai from 'chai'

const { assert } = chai

const notNull = str => (str !== null ? Success.of(str) : Failure.of(['String is null']))
const notEmpty = str => (str.length > 0 ? Success.of(str) : Failure.of(['String is empty']))
const toLower = str => str.toLowerCase()

describe('Validation', () => {
  it('Constructor', () => {
    const result = Validation.Success(2).get()
    assert.equal(result, 2)
    assert.throws(() => {
      new Validation(42)
    }, `Can't directly instantiate a Validation. Please use constructor Validation.of`)
    assert.throws(() => {
      Validation.Failure(42).get()
    }, `Can't extract the value of a Failure`)
  })

  it('Validation#map', () => {
    const success = Validation.Success(2).map(x => x ** 2)
    assert.equal(success.get(), 4)

    const failure = Validation.Failure(3).map(x => x ** 2)
    assert.throws(() => {
      failure.get()
    }, `Can't extract the value of a Failure`)
  })

  it('Validation#map (with strings)', () => {
    assert.equal(notNull('JavaScript').flatMap(notEmpty).map(toLower).get(), 'javascript')
    assert.isOk(notNull(null).flatMap(notEmpty).map(toLower).isFailure)
  })

  it('Validation#ap', () => {
    const add = x => y => x + y
    const val = Validation.Success(add)
      .ap(Validation.Success(1))
      .ap(Validation.Success(3))
    assert.equal(val.get(), 4)
  })

  it('Validation#toString', () => {
    assert.equal(Validation.Success(1).toString(), 'Success (1)')
  })

  it('Validation#[Symbol.iterator]', () => {
    const [, right] = Validation.Success(2)

    assert.equal(right.get(), 2)
    assert.isOk(right.isSuccess)

    const [left,] = Validation.Failure(new Error('Error occurred!'))

    assert.equal(left.getOrElse(5), 5)
    assert.isOk(left.isFailure)
  })
})
