// https://github.com/facebookarchive/flow-remove-types/issues/70
// Wiating for Flow support
// @flow
import Validation from '@joj/blockchain/util/fp/data/validation2/validation.js'
import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai

// // Needed for mocha
// declare var describe: any
// declare var it: any

// const decode = (charset = 'utf8') => (buffer: buffer$Encoding): string =>
//   !buffer ? '' : buffer.toString()

// const parseBlocks = (str: string): Array<string> => (str || '').split(/\s+/)

// const count = (arr: Array<string>): number => (!arr ? 0 : arr.length)

// const compose = (...fns: Array<(any) => any>) => (x: any): any => fns.reduceRight((v, f) => f(v), x)

// const filename: string = path.join(__dirname, '../../', 'res', 'sample.txt')

describe('1.7 - Types for JavaScript?', () => {
  //   it('Composition of countBlocksInFile with type information', () => {
  //     const read = fs.readFileSync
  //     const countWordsInFile: string => number = compose(
  //       count,
  //       parseBlocks,
  //       decode('utf8'),
  //       read
  //     )
  //     const result = countWordsInFile(filename)
  //     console.log('Result is: ', result)
  //     assert.equal(result, 7)
  //   })
  //   it('countBlocksInFile using Validation', () => {
  //     const { Success, Failure } = Validation
  //     interface ADT {
  //       map: (f: (any) => any) => ADT;
  //       value: any;
  //     }
  //     interface SuccessT extends ADT {
  //       IsSuccess: boolean;
  //     }
  //     interface FailureT extends ADT {
  //       IsFailure: boolean;
  //     }
  //     type ValidationT = SuccessT | FailureT
  //     const read = (f: string): ValidationT =>
  //       fs.existsSync(f) ? Success(fs.readFileSync(f)) : Failure([`File ${f} does not exist!`])
  //     assert.exists(read(filename).get())
  //   })
})
