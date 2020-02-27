import Validation, { Failure, Success } from './index.js'
import chai from 'chai'
import { curry } from '../../combinators.js'

const { assert } = chai

const notEmpty = str => (str && str.length > 0 ? Success(str) : Failure(['String is empty']))

const notExceeds = curry((n, str) =>
  str.length <= n ? Success(str) : Failure([`String exceeds set length of ${n}`])
)

const startsWithNumber = str =>
  Number.isInteger(str[0]) ? Success(str) : Failure(['Strings does not start with a number'])

describe('Validation', () => {
  it('fromNullable', () => {
    assert.isOk(Validation.fromNullable('Some Value').isSuccess)
    assert.isOk(Validation.fromNullable(null).isFailure)
  })

  it('of', () => {
    assert.isOk(Validation.of(3).isSuccess)
    assert.isOk(Validation.of(3).fold(), Validation.of(3).merge())
  })

  it('real world: non-empty', () => {
    let data = ''
    let v = Validation.of(_ => data).ap(notEmpty(data))
    assert.isOk(v.isFailure())
    assert.deepEqual(['String is empty'], v.merge())

    data = 'luis atencio'
    v = Validation.of(x => x).ap(notEmpty(data))
    assert.isOk(v.isSuccess())
    assert.deepEqual('luis atencio', v.merge())
  })

  it('real world: not exceeds and startsWithNumber', () => {
    const data = 'luis atencio'
    const v = Validation.of(x => x => x)
      .ap(notExceeds(3, data))
      .ap(startsWithNumber(data))
    assert.isOk(v.isFailure())
    assert.deepEqual(
      ['String exceeds set length of 3', 'Strings does not start with a number'],
      v.merge()
    )
  })

  it('real world: not exceeds, startsWithNumber, with notEmpty', () => {
    const data = 'luis atencio'
    const v = Validation.of(x => x => x)
      .ap(notExceeds(3, data))
      .ap(startsWithNumber(data))
      .ap(notEmpty(data))
    assert.isOk(v.isFailure())
    assert.deepEqual(
      ['String exceeds set length of 3', 'Strings does not start with a number'],
      v.merge()
    )
  })
})
