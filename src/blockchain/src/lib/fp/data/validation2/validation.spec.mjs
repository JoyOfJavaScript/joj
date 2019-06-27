import Validation from './validation.mjs'
import chai from 'chai'

const { assert } = chai

describe('Validation', () => {
  it('Constructor', () => {
    const result = Validation.Success(2).get()
    assert.equal(result, 2)
    assert.throws(() => {
      new Validation(42)
    }, `Can't directly constructor a Validation. Please use constructor Validation.of`)
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

  it('Validation#ap', () => {
    const add = x => y => x + y
    const val = Validation.Success(add)
      .ap(Validation.Success(1))
      .ap(Validation.Success(3))
    assert.equal(val.get(), 4)
  })

  it('Validation#equals', () => {
    assert.isNotOk(Validation.Success(1) === Validation.Success(1))
    assert.isNotOk(Validation.Success(1) === Validation.Success(1))
    assert.isOk(Validation.Success(1).equals(Validation.Success(1)))
  })

  it('Validation#toString', () => {
    assert.equal(Validation.Success(1).toString(), 'Success (1)')
  })
})
