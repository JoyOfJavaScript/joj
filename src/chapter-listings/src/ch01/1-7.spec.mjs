// https://github.com/facebookarchive/flow-remove-types/issues/70
// @flow

import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai

declare var describe: any
declare var it: any

const decode = (charset = 'utf8') => (buffer: Buffer): string =>
  !buffer ? '' : buffer.toString(charset)

const tokenize = (delimeter: string) => (str = '') => str.split(delimeter)

const count = (arr: Array<string>) => (!arr ? 0 : arr.length)

const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)

const filename: string = path.join(process.cwd(), 'res', 'blocks.txt')

describe('1.7 - Types for JavaScript?', () => {

  // it('Composition of countBlocksInFile with type information', () => {
  //   const read: string => Buffer = fs.readFileSync
  //   const countBlocksInFile: string => number = compose(
  //     count,
  //     tokenize(';'),
  //     decode('utf8'),
  //     read
  //   )
  //   const result = countBlocksInFile(filename)
  //   console.log('Result is: ', result)
  //   assert.equal(result, 3)
  // })

})
