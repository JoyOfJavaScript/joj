// @flow
import { assert } from 'chai'
// import Validation from '../lib/fp/data/validation'
// import type ValidationT from '../lib/types/ValidationT'
import fs from 'fs'
import path from 'path'

// Needed for mocha
declare var describe: any
declare var it: any

const decode = (charset: string = 'utf8') => (
  buffer: buffer$Encoding
): string => (!buffer ? '' : buffer.toString())

const parseBlocks = (str: string): Array<string> => (str || '').split(/\s+/)

const count = (arr: Array<string>) => (!arr ? 0 : arr.length)

const compose = (...fns: Array<(any) => any>) => (x: any): any =>
  fns.reduceRight((v, f) => f(v), x)

const read = fs.readFileSync

const filename = path.join(__dirname, '../../', 'res', 'sample.txt')

describe('1.7 - Types for JavaScript?', () => {
  it('Composition of countBlocksInFile with type information', () => {
    const countWordsInFile: string => number = compose(
      count,
      parseBlocks,
      decode('utf8'),
      read
    )

    const result = countWordsInFile(filename)
    console.log('Result is: ', result)
    assert.equal(result, 7)
  })

  // it('Should read the contensts of a file into Result', () => {
  //   const { Success, Failure } = Validation

  //   function read (name: string): ValidationT {
  //     return fs.existsSync(name)
  //       ? Success(fs.readFileSync(name))
  //       : Failure(['File does not exist!'])
  //   }

  //   expect(
  //     read(file)
  //       .map(decode)
  //       .isSuccess()
  //   ).to.be.true
  //   expect(read('xxx').isFailure()).to.be.true

  //   // function countResult(result: _Result<buffer$Encoding>): number {
  //   //   return result
  //   //     .map(decode)
  //   //     .map(tokenize)
  //   //     .map(count)
  //   //     .getOrElse(0)
  //   // }

  //   // expect(countResult(read(file))).to.be.equal(7)
  // })
})
