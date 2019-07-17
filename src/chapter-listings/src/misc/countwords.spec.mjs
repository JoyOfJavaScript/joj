import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai

const file = path.join(process.cwd(), 'src/misc', 'sample.txt')

const decode = buffer => buffer.toString()

const split = str => (str || '').split(/\s+/)

const count = arr => (!arr ? 0 : arr.length)

const read = fs.readFileSync

const compose2 = (f, g) => (...args) => f(g(...args))

describe('Count words', () => {
  it('compose2', () => {
    const countWords = compose2(count, split)
    const result = countWords('1 2 3')
    console.log('Result is: ', result)
    assert.equal(result, 3)
  })
  it('pipeline', () => {
    // const result = 2 |> double |> (x => 3 + x) |> (x => toStringBase(2, x))
    const result = '1 2 3' |> split |> count
    assert.equal(result, 3)

    const result2 = '1 2 3' |> split |> count |> (x => x ** 2)
    assert.equal(result2, 9)
  })
  it('Count blocks imperative', () => {
    function countWords(filename) {
      const buffer = fs.readFileSync(filename)
      const contents = buffer.toString()
      const arr = contents.split(/\s+/)
      return arr.length
    }
    const result = countWords(file)
    console.log('Result is: ', result)
    assert.equal(result, 9)
  })
  it('Count blocks using composition', () => {
    const compose = (...fns) => fns.reduce(compose2)

    const countWords = compose(
      count,
      split,
      decode,
      read
    )

    const result = countWords(file)
    console.log('Result is: ', result)
    assert.equal(result, 9)
    assert.equal(result, count(split(decode(read(file)))))
  })

  it('Count blocks using compose2', () => {
    const countWords = compose2(compose2(count, split), compose2(decode, read))

    const result = countWords(file)
    console.log('Result is: ', result)
    assert.equal(result, 9)
    assert.equal(result, count(split(decode(read(file)))))
  })
})
