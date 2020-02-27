import chai from 'chai'
import { compose2 } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const { assert } = chai

const decode = buffer => buffer.toString()
const read = fs.readFileSync
const split = str => (str || '').split(/\s+/)
const count = arr => (!arr ? 0 : arr.length)

describe('4.2.2 - Working with side effects', () => {
  let file = null
  beforeEach(() => {
    file = path.join(process.cwd(), 'src/ch04', 'sample.txt')
  })
  it('Imperative function that counts words in a text file', () => {
    function countWordsInFile(file) {
      const fileBuffer = fs.readFileSync(file)
      const wordsString = fileBuffer.toString()
      const wordsInArray = wordsString.split(/\s+/)
      return wordsInArray.length
    }
    assert.equal(countWordsInFile(file), 9)
  })
  it('Counting words using manual composition', () => {
    const countWordsInFile = file => count(split(decode(read(file))))
    assert.equal(countWordsInFile(file), 9)
  })
  it('Counting words using compose2', () => {
    const countWordsInFile = compose2(compose2(count, split), compose2(decode, read))
    assert.equal(countWordsInFile(file), 9)
  })
  it('Shows simple reduce', () => {
    const sum = (a, b) => a + b
    assert.equal([1, 2, 3, 4, 5, 6].reduce(sum), 21)
  })
  it('countWordsInFile implemented with compose', () => {
    const compose = (...fns) => fns.reduce(compose2)
    const countWordsInFile = compose(
      count,
      split,
      decode,
      read
    )
    assert.equal(countWordsInFile(file), 9)
  })
})
