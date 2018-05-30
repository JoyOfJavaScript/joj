//@flow
import { expect } from 'chai'
import fs from 'fs'
import path from 'path'
import { Combinators, Result } from '@joj/adt'

const decode = (buffer: buffer$Encoding): string =>
  !buffer ? '' : buffer.toString()

const tokenize = (str: string): Array<string> => (str || '').split(/\s+/)

const count = (arr: Array<string>) => (!arr ? 0 : arr.length)

const compose = (...fns: Array<(any) => any>) => (x: any): any =>
  fns.reduceRight((v, f) => f(v), x)

const read = fs.readFileSync

const file = path.join(__dirname, '..//..', 'res', 'sample.txt')

describe('Composition with types', () => {
  it('Should count the words in a file using function composition and types', () => {
    const countWords: string => number = compose(count, tokenize, decode, read)

    const result = countWords(file)
    console.log('Result is: ', result)
    expect(result).to.be.equal(7)
  })

  it('Should read the contensts of a file into Result', () => {
    const { Ok, Error } = Result

    type _Ok<T> = {
      map: (*) => *,
      get: () => T,
      getOrElse: (d: string) => T,
    }

    type _Error = {
      map: (*) => *,
      get: Error,
      getOrElse: (d: string) => string,
    }

    type _Result<T> = _Ok<T> | _Error

    const read: string => _Result<buffer$NonBufferEncoding> = name =>
      fs.existsSync(name)
        ? Ok(fs.readFileSync(name))
        : Error('File does not exist!')

    // expect(read(file).isOk()).to.be.true
    // expect(read('xxx').isError()).to.be.true

    const countResult: (_Result<buffer$NonBufferEncoding>) => number = r =>
      r
        .map(decode)
        .map(tokenize)
        .map(count)
        .getOrElse(0)

    expect(countResult(read(file))).to.be.equal(7)
  })
})
