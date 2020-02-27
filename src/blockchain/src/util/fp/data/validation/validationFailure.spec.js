import { Failure, Success } from './index.js'
import chai from 'chai'

const { assert } = chai

const toLower = str => str.toLowerCase()
const first = n => str => str.substring(0, n)
const add = a => b => a + b

describe('Validation#Failure', () => {
  it('Type', () => {
    assert.equal(Failure('Some Value')['@@type'], 'Validation')
    assert.isOk(
      Failure('Some value')
        .toString()
        .includes('Validation#Failure')
    )
  })
  it('Fold', () => {
    assert.throws(() => Failure('FAILED!').fold(), TypeError)
    assert.throws(() => Failure(null).fold(), TypeError)
  })
  it('Map', () => {
    assert.deepEqual(
      Failure('FAILED!')
        .map(toLower)
        .merge(),
      'FAILED!'
    )
    assert.deepEqual(
      Failure('FAILED!')
        .map(toLower)
        .map(first(4))
        .merge(),
      'FAILED!'
    )
  })

  it('Apply', () => {
    assert.deepEqual(
      Failure(['FAILED ONCE!'])
        .ap(Failure(['FAILED AGAIN!']))
        .merge(),
      ['FAILED ONCE!', 'FAILED AGAIN!']
    )

    assert.deepEqual(
      Failure('FAILED!')
        .ap(Success(x => x))
        .merge(),
      'FAILED!'
    )

    assert.deepEqual(
      Success(add)
        .ap(Failure('Error adding first'))
        .ap(Success(3))
        .merge(),
      'Error adding first'
    )

    assert.deepEqual(
      Success(add)
        .ap(Success(3))
        .ap(Failure('Error adding second'))
        .merge(),
      'Error adding second'
    )
  })

  it('Bimap', () => {
    assert.equal(
      Failure('FAILED!')
        .bimap(() => {
          throw 'Fail test!'
        }, toLower)
        .merge(),
      'failed!'
    )
  })

  it('Bifold', () => {
    assert.equal(
      Failure('FAILED!').bifold(() => {
        throw 'Fail test!'
      }, toLower),
      'failed!'
    )
  })
})
