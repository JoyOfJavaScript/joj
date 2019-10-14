import Block from '../Block.mjs'
import Blockchain from '../Blockchain.mjs'
import JSLCoinService from './JSLCoinService.mjs'
import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai

describe('JSLCoinService Spec', () => {
  it('Write a chain object to a file', () => {
    const chain = new Blockchain()
    chain.push(new Block(chain.height() + 1, chain.top.hash, []))
    chain.push(new Block(chain.height() + 1, chain.top.hash, []))
    assert.equal(chain.height(), 3)
    const service = JSLCoinService(chain)
    const file = path.join(process.cwd(), 'src/domain/service', 'file.txt')
    const rawLedger = service.serializeLedger()
    try {
      fs.writeFileSync(file, rawLedger)
    }
    finally {
      // fs.unlink(file, err => {
      //   if (err) throw err
      //   console.log(`${file} was deleted`)
      // })
    }
  })
})
