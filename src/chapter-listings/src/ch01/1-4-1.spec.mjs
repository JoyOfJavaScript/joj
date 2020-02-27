import Validation from '@joj/blockchain/util/fp/data/validation2/validation.js'
import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai
const { Failure, Success } = Validation

const read = f =>
  fs.existsSync(f) ? Success(fs.readFileSync(f)) : Failure([`File ${f} does not exist!`])

describe('1.4.1 - Algebraic Coding', () => {
  it('Implement read using Validation ADT', () => {
    assert.isNotNull(Failure)
    assert.isNotNull(Success)
    const filename = path.join(process.cwd(), 'res', 'sample.txt')
    assert.isOk(read(filename).isSuccess)
    assert.isOk(read('/invalid/path/to/file').isFailure)
    assert.deepEqual(read('/invalid/path/to/file').getOrElse('default'), 'default')
  })

  it('countBlocksInFile using Validation#map', () => {
    const decode = (charset = 'utf8') => buffer => (!buffer ? '' : buffer.toString(charset))

    const parseBlocks = str => (str || '').split(/\s+/)

    const count = arr => (!arr ? 0 : arr.length)

    const countBlocksInFile = f =>
      read(f)
        .map(decode('utf8'))
        .map(parseBlocks)
        .map(count)

    const filename = path.join(process.cwd(), 'res', 'sample.txt')
    assert.equal(countBlocksInFile(filename).get(), 7)
  })
})
