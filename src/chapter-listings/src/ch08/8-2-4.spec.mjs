import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const fsp = fs.promises
const { assert } = chai
const decode = curry((charset, buffer) => (!buffer ? '' : buffer.toString(charset)))
const tokenize = curry((delimeter, str) => (str || '').split(delimeter))
const count = arr => (!arr ? 0 : arr.length)


describe('8.2.4 - Promises in the wild', () => {
  it('Listing 8.2 Counting all blocks in file', async () => {
    function countBlocksInFile(file) {
      return fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)
        .then(() => {  //#A
          return fsp.readFile(file)
        })
        .then(decode('utf-8'))
        .then(tokenize(';'))
        .then(count)
        .catch(error => {
          throw new Error(`File ${file} does not exist or you have 
                no read permissions. Details: ${error.message}`)
        })
    }

    const filename = path.join(process.cwd(), 'res', 'blocks.txt')
    const result = await countBlocksInFile(filename)
      .then(result => {
        return result // 3
      })
    assert.equal(3, result)
  })

  it('Listing 8.3 Mining a block in the chain', async () => {
    // You can find this code + test in the blockchain project
  })
})
