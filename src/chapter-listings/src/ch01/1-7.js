// @flow
import Validation from '@joj/blockchain/lib/fp/data/validation2'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'
import { parse } from 'querystring'

// Needed for mocha
declare var describe: any
declare var it: any

const decode = (charset = 'utf8') => (buffer: buffer$Encoding): string =>
  !buffer ? '' : buffer.toString()

const parseBlocks = (str: string): Array<string> => (str || '').split(/\s+/)

const count = (arr: Array<string>): number => (!arr ? 0 : arr.length)

const compose = (...fns: Array<(any) => any>) => (x: any): any =>
  fns.reduceRight((v, f) => f(v), x)

const filename: string = path.join(__dirname, '../../', 'res', 'sample.txt')

describe('1.7 - Types for JavaScript?', () => {
  it('Composition of countBlocksInFile with type information', () => {
    const read = fs.readFileSync

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
    interface IADT {
      map: (f: (any) => any) => IADT<any>;
      value: any;
    }
    interface ISuccess extends IADT {
      IsSuccess: boolean;
    }

    interface IFailure extends IADT {
      IsFailure: boolean;
    }

    type IValidation = ISuccess | IFailure

    const read = (f: string): IValidation =>
      fs.existsSync(f)
        ? Success(fs.readFileSync(f))
        : Failure([`File ${f} does not exist!`])

    assert.exists(read(filename).value)
  })
})
