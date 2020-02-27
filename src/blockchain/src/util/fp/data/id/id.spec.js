import Id from './index.js'
import chai from 'chai'

const { assert } = chai

describe('ID', () => {
  it('Constructor', () => {
    const result = Id.of(2).get()
    assert.equal(result, 2)
  })

  it('Id#map', () => {
    const result = Id.of(2).map(x => x ** 2)
    assert.equal(result.get(), 4)
  })
})
