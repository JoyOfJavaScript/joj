import { assert } from 'chai'
import { Validation } from '../src'

describe('Validation', () => {
  it('fromNullable', () => {
    assert.isOk(Validation.fromNullable('Some Value').isSuccess)
    assert.isOk(Validation.fromNullable(null).isFailure)
  })
})
