import { assert } from 'chai'
import { compose, tap, curry } from 'ramda'
import fs from 'fs'
import path from 'path'

const read = file => fs.readFileSync(file)

const decode = (charset = 'utf8') => buffer =>
  !buffer ? '' : buffer.toString(charset)

const tokenize = str => (str || '').split(/\s+/)

const count = arr => (!arr ? 0 : arr.length)

describe('Composition', () => {
  it('Should count the words in a file using function composition', () => {
    const words = compose(
      count,
      tokenize,
      tap(console.log),
      decode('utf8'),
      read
    )

    const file = path.join(__dirname, '..//..', 'res', 'sample.txt')
    const result = words(file)
    console.log('Result is: ', result)
    assert.isTrue(result >= 6)
  })

  it('Should illustrate simple currying', () => {
    const add = curry((a, b) => a + b)
    const increment = add(1)
    assert.equal(increment(2), 3)
  })
})
