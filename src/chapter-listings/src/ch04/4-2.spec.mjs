import chai from 'chai'

const { assert } = chai

describe('4.2 - Composition: the functional way', () => {
  it('Demonstrates compose2', () => {
    const compose2 = (f, g) => (...args) => f(g(...args))

    const count = arr => arr.length
    const split = str => str.split(/\s+/)

    const input = 'functional programming'
    assert.equal(count(split(input)), compose2(count, split)(input))
  })
})
