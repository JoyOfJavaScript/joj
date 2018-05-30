import { assert } from 'chai'
import { Combinators } from '@joj/adt'
import fs from 'fs'
import path from 'path'

const { curry } = Combinators

const decode = curry(
  (charset, buffer) => (!buffer ? '' : buffer.toString(charset))
)

const tokenize = str => (str || '').split(/\s+/)

const count = arr => (!arr ? 0 : arr.length)

describe('Async/Await', () => {
  it('Should count the words in a file using promises', async () => {
    const exists = f =>
      new Promise((resolve, reject) => {
        fs.access(f, fs.constants.R_OK, err => {
          if (err) {
            reject(`File ${f} does not exists or no read access allowed`)
          } else {
            resolve(f)
          }
        })
      })

    const read = f =>
      new Promise((resolve, reject) => {
        fs.readFile(f, (err, data) => {
          if (err) {
            reject(`Unable to read file ${f}`)
          } else {
            resolve(data)
          }
        })
      })

    async function countWords(f) {
      if (await exists(f)) {
        const data = await read(f)
        const decodedData = decode('utf8', data)
        const tokens = tokenize(decodedData)
        return count(tokens)
      }
    }

    const file = path.join(__dirname, '..//..', 'res', 'sample.txt')
    const result = await countWords(file)
    console.log('Result is: ', result)
    assert.isTrue(result >= 6)
  })

  it('Should count the words in a file using promises', async () => {
    const exists = f =>
      new Promise((resolve, reject) => {
        fs.access(f, fs.constants.R_OK, err => {
          if (err) {
            reject(`File ${f} does not exists or no read access allowed`)
          } else {
            resolve(f)
          }
        })
      })

    const read = f =>
      new Promise((resolve, reject) => {
        fs.readFile(f, (err, data) => {
          if (err) {
            reject(`Unable to read file ${f}`)
          } else {
            resolve(data)
          }
        })
      })

    async function countWords(f) {
      if (await exists(f)) {
        const data = await read(f)
        const decodedData = decode('utf8', data)
        const tokens = tokenize(decodedData)
        return count(tokens)
      }
    }

    const file = path.join(__dirname, '..//..', 'res', 'sample.txt')
    const result = await countWords(file)
    console.log('Result is: ', result)
    assert.isTrue(result >= 6)
  })
})
