import BitcoinService from './service/BitcoinService.js'
import Block from './Block.js'
import Blockchain from './Blockchain.js'
import Builder from '../domain.js'
import Money from './value/Money.js'
import Transaction from './Transaction.js'
import chai from 'chai'
import { toJson } from '~util/helpers.js'

const { assert } = chai

describe('Block Spec', () => {
  it('Should create genesis block', () => {
    const b = new Block(1, '-1', [])
    assert.equal(b.previousHash, '-1')
  })
  it('Should create a new block using Builders', () => {
    const { Block: BlockBuilder } = Builder
    const b = Object.create(BlockBuilder)
      .at(1)
      .linkedTo('-1')
      .withPendingTransactions([])
      .build()
    assert.equal(b.previousHash, '-1')
    assert.isEmpty(b.data)
  })

  it('Should create a new  block using Builders with bind operator', () => {
    const { Block: BlockBuilder } = Builder
    const { at, linkedTo, withPendingTransactions, build } = BlockBuilder
    const b = {}
      :: at(1)
      :: linkedTo('-1')
      :: withPendingTransactions([])
      :: build()
    assert.equal(b.previousHash, '-1')
    assert.isEmpty(b.data)
  })

  it('Should serialize a block and its contained transaction data', () => {
    const { Block: BlockBuilder } = Builder
    const { at, linkedTo, withPendingTransactions, build } = BlockBuilder
    const b = {}
      :: at(1)
      :: linkedTo('-1')
      :: withPendingTransactions(new Transaction('sally', 'luke', Money('₿', 0.1), null))
      :: build()
    const blockJsonStr = toJson(b);
    assert.ok(blockJsonStr.length > 1)
    assert.equal(JSON.parse(blockJsonStr).hash, b.hash);
    assert.equal(JSON.parse(blockJsonStr).dataCount, 1);

    const txJson = JSON.parse(JSON.parse(blockJsonStr).data);
    assert.equal(txJson.id, b.data[0].id);
    assert.isNotEmpty(b.data)
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
    assert.deepEqual(b.data, ['1', '2', '3'])
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
    assert.ok(JSON.parse(b[Symbol.for('toJSON')]()).previousHash)
    assert.notOk(JSON.parse(b[Symbol.for('toJSON')]()).difficulty)
  })

  it('Should validate block', async () => {
    const chain = new Blockchain()
    const bitcoin = BitcoinService(chain)
    await bitcoin.mineNewBlockIntoChain(
      new Block(chain.height() + 1, chain.top.hash, [])
    )
    const block = chain.top
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

  it('Tests toString', () => {
    const chain = new Blockchain()
    const block = new Block(chain.height() + 1, chain.top.hash, []);
    assert.equal(block.toString(), '[object Block]')
  })
})
