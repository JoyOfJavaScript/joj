import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const { assert } = chai

const decode = (encoding = 'utf8') => buffer => buffer.toString(encoding)
const read = fs.readFileSync
const split = str => (str || '').split(/\s+/)
const count = arr => (!arr ? 0 : arr.length)

describe('4.5 - Point-free coding', () => {
  let file = null
  let file2 = null
  beforeEach(() => {
    file = path.join(process.cwd(), 'src/ch04', 'sample.txt')
    file2 = path.join(process.cwd(), 'src/ch04', 'point-free-sample.txt')
  })
  it('Count words/blocks in file as point-free', () => {
    const countWordsInFile = compose(
      count,
      split,
      decode('utf8'),
      read
    )

    assert.equal(countWordsInFile(file), 9)

    const countBlocksInFile = compose(
      count,
      JSON.parse,
      decode('utf8'),
      read
    )
    assert.equal(countBlocksInFile(file2), 3)
  })
})
