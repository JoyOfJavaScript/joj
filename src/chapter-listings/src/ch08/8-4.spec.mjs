import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const fsp = fs.promises
const { assert } = chai

const decode = curry((charset, buffer) => (!buffer ? '' : buffer.toString(charset)))
const tokenize = curry((delimeter, str) => (str || '').split(delimeter))
const count = arr => (!arr ? 0 : arr.length)

describe('8.4 - Async made easy with async/await', () => {
  it('countBlocksInFile using standard promises', () => {
    function countBlocksInFile(file) {
      return fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)
        .then(() => {
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

    return countBlocksInFile(path.join(process.cwd(), 'res', 'blocks.txt'))
      .then(result => {
        console.log('Result is: ', result)
        assert.equal(result, 3)
      })
  })

  it('Listing 8.4 Uses async/await to count blocks in blocks.txt', async () => {
    async function countBlocksInFile(file) {  //#A
      try {
        await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK) //#B
        const data = await fsp.readFile(file) //#C
        const decodedData = decode('utf8', data)
        const blocks = tokenize(';', decodedData)
        return count(blocks)
      }
      catch (e) { //#D
        throw new Error(`File ${file} does not exist or you have 
            no read permissions. Details: ${e.message}`)
      }
    }
    const result = await countBlocksInFile(path.join(process.cwd(), 'res', 'blocks.txt'))
    assert.equal(result, 3)
  })

  it('Pipe operator with async/await', async () => {
    async function countBlocksInFile(file) {
      try {
        await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)
        const data = await fsp.readFile(file)
        const decodedData = decode('utf8', data)
        const blocks = tokenize(';', decodedData)
        return count(blocks)
      } catch (e) {
        throw new Error(`File ${file} does not exist or you have 
                no read permissions. Details: ${e.message}`)
      }
    }

    const { join, normalize, extname } = path

    function txtResource(strings, resourcePath) {
      const name = strings[1] ?.toLowerCase() ?? throw new Error("Expected non-null filename")
      console.log('extension name', extname(name) ?.toLowerCase())
      const extension = extname(name) ?.toLowerCase() || '.txt'
        return normalize(join(process.cwd(), resourcePath, `${name}${extension}`))
    }

    const resources = 'res'
    const blocks = txtResource`${resources}blocks` |> (await countBlocksInFile)
    assert.equal(await blocks, 3)
    const blocks2 = path.join(process.cwd(), 'res', 'blocks.txt') |> (await countBlocksInFile)
    assert.equal(await blocks2, 3)
  })
})
