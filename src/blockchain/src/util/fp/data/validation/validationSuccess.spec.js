import { Success } from './index.js'
import chai from 'chai'
import { compose } from '../../combinators.js'

const { assert } = chai

const toLower = str => str.toLowerCase()
const first = n => str => str.substring(0, n)
const add = a => b => a + b

describe('Validation#Sucess', () => {
  it('Type', () => {
    assert.equal(Success('Some Value')['@@type'], 'Validation')
  })

  it('Identity', () => {
    assert.equal(
      Success('Some Value')
        .map(x => x)
        .fold(),
      'Some Value'
    )
  })

  it('Fold', () => {
    assert.equal(Success('Some Value').fold(), 'Some Value')
    assert.equal(Success('Some Value').fold(x => x), 'Some Value')
    assert.equal(Success('Some Value').fold(toLower), 'some value')
  })
  it('Map', () => {
    assert.equal(
      Success('Some Value')
        .map(toLower)
        .fold(),
      'some value'
    )
    assert.equal(
      Success('Some Value')
        .map(toLower)
        .map(first(4))
        .fold(),
      'some'
    )
    assert.equal(
      Success('Some Value')
        .map(
          compose(
            first(4),
            toLower
          )
        )
        .fold(),
      'some'
    )
  })
  it('Apply', () => {
    // identity
    assert.equal(
      Success('Some Value')
        .ap(Success(x => x))
        .fold(),
      'Some Value'
    )
    // homomorphism
    assert.equal(
      Success('Some Value')
        .ap(Success(x => x))
        .fold(),
      Success((x => x)('Some Value')).fold()
    )

    assert.equal(
      Success('Some Value')
        .ap(Success(toLower))
        .fold(),
      'some value'
    )
    assert.equal(
      Success(toLower)
        .ap(Success('Some Value'))
        .fold(),
      'some value'
    )
    assert.equal(
      Success('Some Value')
        .ap(
          Success(
            compose(
              first(4),
              toLower
            )
          )
        )
        .fold(),
      'some'
    )
    assert.equal(
      Success(add)
        .ap(Success(2))
        .ap(Success(3))
        .fold(),
      5
    )
  })
  it('Bimap', () => {
    assert.equal(
      Success('Some Value')
        .bimap(toLower, () => {
          throw 'Fail test!'
        })
        .merge(),
      'some value'
    )
  })
  it('Bifold', () => {
    assert.equal(
      Success('Some Value').bifold(toLower, () => {
        throw 'Fail test!'
      }),
      'some value'
    )
  })
})
