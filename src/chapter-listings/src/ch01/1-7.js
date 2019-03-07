// @flow
import Validation from '@joj/blockchain/lib/fp/data/validation2'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'

// Needed for mocha
declare var describe: any
declare var it: any

const decode = (charset: string = 'utf8') => (
  buffer: buffer$Encoding
): string => (!buffer ? '' : buffer.toString())

const parseBlocks = (str: string): Array<string> => (str || '').split(/\s+/)

const count = (arr: Array<string>): number => (!arr ? 0 : arr.length)

const compose = (...fns: Array<(any) => any>) => (x: any): any =>
  fns.reduceRight((v, f) => f(v), x)

let read = fs.readFileSync

const filename: string = path.join(__dirname, '../../', 'res', 'sample.txt')

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

  it('countBlocksInFile using Validation', () => {
    const { Success, Failure } = Validation

    interface ADT<T> {
      map: <T2>(f: (a: T) => T2) => ADT<T2>;
    }

    type SuccessT<T> = ADT<T> & Success
    type FailureT<T> = ADT<T> & Failure
    type ValidationT<T> = SuccessT<T> | FailureT<T>

    read = (f: string): ValidationT<string> =>
      fs.existsSync(f)
        ? Success(fs.readFileSync(f))
        : Failure([`File ${f} does not exist!`])

    const countBlocksInFile = (f: string): ValidationT<number> =>
      read(f)
        .map(decode('utf8'))
        .map(parseBlocks)
        .map(count)

    assert.equal(countBlocksInFile(filename).value, 7)

    // function countResult(result: _Result<buffer$Encoding>): number {
    //   return result
    //     .map(decode)
    //     .map(tokenize)
    //     .map(count)
    //     .getOrElse(0)
    // }

    // expect(countResult(read(file))).to.be.equal(7)
  })
})
