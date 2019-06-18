import Block from './Block'
import Blockchain from './Blockchain'
import Builder from './'
import JSLCoinService from './service/JSLCoinService'
import { assert } from 'chai'

describe('Block Spec', () => {
  it('Should create genesis block', () => {
    const b = new Block(1, '-1', [])
    assert.equal(b.previousHash, '-1')
  })
  it('Should create a new  block using Builders', () => {
    const b = new Builder.Block()
      .at(1)
      .linkedTo('-1')
      .withPendingTransactions([])
      .build()
    assert.equal(b.previousHash, '-1')
    assert.isEmpty(b.transactions)
  })

  it('Should init a new block', () => {
    const b = new Block(1, '123', [])
    assert.equal(b.previousHash, '123')
    b.timestamp = 'tomorrow'
    assert.equal(b.timestamp, 'tomorrow')
    const currentHash = b.hash
    b.nonce = 99
    b.hash = b.calculateHash()
    assert.notEqual(currentHash, b.hash)
  })

  it('Should init a new trasactional block', () => {
    const b = new Block(1, '123', ['1', '2', '3'])
    assert.deepEqual(b.transactions, ['1', '2', '3'])
    assert.equal(b.previousHash, '123')
    assert.equal(b.nonce, 0)
  })

  it('Should check core properties', () => {
    const b = new Block(1, '123', ['1', '2', '3'])
    b.hash = b.calculateHash()
    const currentHash = b.hash
    assert.ok(currentHash.length > 0)
    b.nonce = 99
    b.hash = b.calculateHash()
    console.log('Hash: ', b.hash)
    assert.ok(b.hash.length > 0)
    assert.notEqual(currentHash, b.hash)
    assert.ok(b.toJSON().previousHash)
    assert.notOk(b.toJSON().difficulty)
  })

  it('Should validate block', async () => {
    const chain = new Blockchain()
    const bitcoin = JSLCoinService(chain)
    const block = await bitcoin.mineNewBlockIntoChain(
      new Block(chain.height() + 1, chain.top.hash, [])
    )
    const validation = block.isValid()
    console.log(validation.toString())
    assert.isOk(validation.isSuccess)
  })

  it('Should validate block 2', async () => {
    const chain = new Blockchain()
    const b2 = new Block(2, chain.top.hash, [])
    const b3 = new Block(3, b2.hash, [])

    chain.push(b2)
    chain.push(b3)

    const validation = b3.isValid()
    console.log(validation.toString())
    assert.isOk(validation.isSuccess)
  })

  it('Should fail validation of two consecutive blocks', async () => {
    const chain = new Blockchain()
    chain.push(new Block(chain.height() + 1, chain.top.hash, []))
    chain.push(new Block(chain.height() + 2, chain.top.hash, []))
    chain.top.index = 0 // tamper with index
    const validation = chain.validate()
    console.log(validation.toString())
    assert.isOk(validation.isFailure)
  })
})
