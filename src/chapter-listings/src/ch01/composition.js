require('@babel/register')({
  extensions: ['.ts', '.js', '.tsx', '.jsx'],
})
import { assert, expect } from 'chai'
import { Combinators, Result } from '@joj/adt'
import fs from 'fs'
import path from 'path'

const { curry } = Combinators

const decode = (charset = 'utf8') => buffer =>
  !buffer ? '' : buffer.toString(charset)

const tokenize = str => (str || '').split(/\s+/)

const count = arr => (!arr ? 0 : arr.length)

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

describe('Composition', () => {
  it('Should count the words in a file using function composition', () => {
    const read = fs.readFileSync

    const countWords = compose(count, tokenize, decode('utf8'), read)

    const file = path.join(__dirname, '..//..', 'res', 'sample.txt')
    const result = countWords(file)
    console.log('Result is: ', result)
    assert.isTrue(result >= 6)
  })

  it('Should count the words in a file using function composition with Result', () => {
    const { Ok, Error } = Result
    const read = name =>
      fs.existsSync(name)
        ? Ok(fs.readFileSync(name))
        : Error('File does not exist!')

    const file = path.join(__dirname, '..//..', 'res', 'sample.txt')

    const countWords = f =>
      read(f)
        .map(decode('utf8'))
        .map(tokenize)
        .map(count)
        .getOrElse(0)

    const result = countWords(file)
    const result2 = countWords('xxx')
    console.log('Result is: ', result)
    assert.isTrue(result >= 6)
    assert.isTrue(result2 === 0)
  })

  it('Should illustrate simple currying', () => {
    const add = curry((a, b) => a + b)
    const increment = add(1)
    assert.equal(increment(2), 3)
  })

  it('Function as object', () => {
    expect(Function.prototype.__proto__).to.be.deep.equal({})
    console.log(Function.prototype.__proto__.constructor)
    expect(Function.prototype.__proto__.constructor.toString()).to.be.equal(
      'function Object() { [native code] }'
    )
  })
})
