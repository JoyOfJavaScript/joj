// @flow
require('@babel/register')({
  extensions: ['.ts', '.js', '.tsx', '.jsx'],
})
import { expect } from 'chai'
import fs from 'fs'
import path from 'path'

const decode = (charset: string = 'utf8') => (
  buffer: buffer$Encoding
): string => (!buffer ? '' : buffer.toString())

const tokenize = (str: string): Array<string> => (str || '').split(/\s+/)

const count = (arr: Array<string>) => (!arr ? 0 : arr.length)

const compose = (...fns: Array<(any) => any>) => (x: any): any =>
  fns.reduceRight((v, f) => f(v), x)

const read = fs.readFileSync

describe('Composition with types', () => {
  it('Should count the words in a file using function composition and types', () => {
    const countWords: string => number = compose(
      count,
      tokenize,
      decode('utf8'),
      read
    )
    const file = path.join(__dirname, '..//..', 'res', 'sample.txt')
    const result = countWords(file)
    console.log('Result is: ', result)
    expect(result).to.be.equal(7)
  })
})
