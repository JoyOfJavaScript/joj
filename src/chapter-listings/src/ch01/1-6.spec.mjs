import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const { assert } = chai
const fsp = fs.promises

const decode = curry((charset, buffer) => (!buffer ? '' : buffer.toString(charset)))

const parseBlocks = str => (str || '').split(/\s+/)

const count = arr => (!arr ? 0 : arr.length)

describe('1.6 - Taming asynchronous code', () => {
  it('CountBlocksInFile using async/await', async () => {
    async function countBlocksInFile(file) {
      try {
        await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)
        const data = await fsp.readFile(file)
        const decodedData = decode('utf8', data)
        const blocks = parseBlocks(decodedData)
        return count(blocks)
      } catch (e) {
        throw new Error(`File ${file} does not exist or you have 
              no read permissions. Details: ${e.message}`)
      }
    }

    const filename = path.join(process.cwd(), 'res', 'sample.txt')
    const result = await countBlocksInFile(filename)
    console.log('Result is: ', result)
    assert.equal(result, 7)
  })
})
