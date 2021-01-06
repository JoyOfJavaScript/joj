import chai from 'chai'

const { assert } = chai

const toUpper = str => str.toUpperCase()
const unique = letters => Array.from(new Set(letters))

describe('5.2 - New Array APIs: {flat, flatMap}', () => {
  it('Intro', () => {
    assert.deepEqual([['aa'], ['bb'], ['cc']].flat(), ['aa', 'bb', 'cc'])
    assert.deepEqual([[2], [3], [4]].flatMap(x => x ** 2), [4, 9, 16])
  })
  it('5.2.1 Array.prototype.flat', () => {
    assert.deepEqual([['aa'], , ['bb'], , ['cc']].flat().map(toUpper), ['AA', 'BB', 'CC'])
    assert.deepEqual([[[[['in here!']]]]].flat(Infinity), ['in here!'])
    assert.deepEqual(['aa', 'bb', 'cc'].map(unique).flat(), ['a', 'b', 'c'])
  })
  it('5.2.2 Array.prototype.flatMap', () => {
    assert.deepEqual(['aa', 'bb', 'cc'].flatMap(unique), ['a', 'b', 'c'])
  })
})
