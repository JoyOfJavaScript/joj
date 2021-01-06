import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import Builders, { Block } from '@joj/blockchain/domain.js'
import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const fsp = fs.promises
const { assert } = chai

const { Block: BlockBuilder } = Builders
const { at, linkedTo, withPendingTransactions, withDifficulty, build: buildBlock } = BlockBuilder
const tokenize = curry((delimeter, str) => (str || '').split(delimeter))

async function* generateBlocksFromFile(file) {
  try {
    await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)

    const dataStream = fs.createReadStream(file,
      { encoding: 'utf8', highWaterMark: 64 }) //1024

    let previousDecodedData = ''

    for await (const chunk of dataStream) {
      previousDecodedData += chunk
      let separatorIndex
      while ((separatorIndex = previousDecodedData.indexOf(';')) >= 0) {
        // line includes the ;
        const decodedData = previousDecodedData.slice(0, separatorIndex + 1)

        // count blocks in row
        const blocks = tokenize(';', decodedData).filter(str => str.length > 0).map(str => str.replace(';', ''))
        // yield blocks (there might be more than one)
        for (const block of blocks) {
          yield JSON.parse(block)
        }
        previousDecodedData = previousDecodedData.slice(separatorIndex + 1)
      }
    }
    if (previousDecodedData.length > 0) {
      console.log('Parsing block', previousDecodedData)
      yield JSON.parse(previousDecodedData)
    }
  }
  catch (e) { //#D
    console.error(`Error processing file: ${e.message}`)
    throw e
  }
}

describe('9.2.3 - Async generators', () => {
  it('Listing 9.3 Async generator that sends blocks read from a file', async () => {
    let result = 0
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')
    for await (const block of generateBlocksFromFile(filename)) { //#A
      console.log('Counting block', block.hash)
      result++
    }
    assert.equal(result, 3)
  })

  it('Listing 9.4 Validate a stream of blocks generated from a file', async () => {
    let validBlocks = 0
    const chain = new Blockchain()
    let skippedGenesis = false
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')
    for await (const blockData of generateBlocksFromFile(filename)) {
      if (!skippedGenesis) {
        skippedGenesis = true
        continue
      }


      console.log('BlockData is', blockData)

      const block = new Block(blockData.index, chain.top.hash, blockData.data, blockData.difficulty);            
      chain.push(block)

      if (block.validate().isFailure) {
        break
      }
      validBlocks++
    }
    assert.equal(validBlocks, 2)
  })
})