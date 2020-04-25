import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import chai from 'chai'
import fs from 'fs'
import path from 'path'
import util from 'util'

const { assert } = chai

describe('8.2 - JavaScript as promised', () => {
  it('Listing 8.1 Wrapping chain validation inside a promise', async () => {
    function validateLedger(ledger) {
      return new Promise((resolve, reject) => {
        const chainValidation = ledger.validate()
        if (chainValidation.isFailure) {
          reject(new Error(`Chain validation failed 
              ${chainValidation.toString()}`))
        }
        resolve(chainValidation)
      })
    }
    const chain = new Blockchain()
    const result = await validateLedger(chain)
    assert.isOk(result.isSuccess)
  })

  it('Uses util.promisify', async () => {
    const read = util.promisify(fs.readFile)
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')
    const fileHandle = await read(filename)
    assert.isOk(fileHandle.length > 0)
  })

  it('Uses fs.promises', async () => {
    const fsp = fs.promises
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')
    const fileHandle = await fsp.readFile(filename)
    assert.isOk(fileHandle.length > 0)
  })
})
