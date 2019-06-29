import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai

describe('1.4 - Higher-order functional programming', () => {
  it('Functions are objects', () => {
    assert.equal(Function.prototype.__proto__.constructor, Object)
  })
  it('Compose using reduce', () => {
    const compose = (...fns) => arg => fns.reduceRight((c, f) => f(c), arg)

    const decode = (charset = 'utf8') => buffer => (!buffer ? '' : buffer.toString(charset))

    const parseBlocks = str => (str || '').split(/\s+/)

    const count = arr => (!arr ? 0 : arr.length)

    const read = fs.readFileSync

    const countBlocksInFile = compose(
      count, // #A
      parseBlocks, // #B
      decode('utf8'), // #C
      read // #D
    )

    const filename = path.join(process.cwd(), 'res', 'sample.txt')
    assert.equal(countBlocksInFile(filename), 7)
  })
})
