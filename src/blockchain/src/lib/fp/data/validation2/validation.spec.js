import Validation from './'
import { assert } from 'chai'

describe('Validation', () => {
  it('Constructor', () => {
    const result = Validation.Success(2).unsafeGet()
    assert.equal(result, 2)
    assert.throws(() => {
      new Validation(42)
    }, `Can't directly constructor a Validation. Please use constructor Validation.of`)
    assert.throws(() => {
      Validation.Failure(42).unsafeGet()
    }, `Can't extract the value of a Failure`)
  })

  it('Validation#map', () => {
    const result = Validation.Success(2).map(x => x ** 2)
    assert.equal(result, 4)
  })
})
