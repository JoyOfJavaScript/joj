import Block from '@joj/blockchain/domain/Block.js'
import HasHash from '@joj/blockchain/domain/shared/HasHash.js'
import HasValidation from '@joj/blockchain/domain/shared/HasValidation.js'
import chai from 'chai'

const { assert } = chai

describe('3.4.1 - Mixin linearization', () => {
  it('Simple mixin linearization', () => {
    const TerrestrialAnimal = {
      walk() {},
      breathe() {
        return 'Using my longs to breathe'
      }
    }

    const AquaticAnimal = {
      swim() {},
      breathe() {
        return 'Using my gills to breathe'
      }
    }

    const Amphibian = Object.assign({ name: 'Frog' }, TerrestrialAnimal, AquaticAnimal)

    assert.equal(Amphibian.name, 'Frog')
    assert.equal(Amphibian.breathe(), 'Using my gills to breathe') // Later sources override earlier ones

    const Amphibian2 = Object.assign({ name: 'Frog' }, AquaticAnimal, TerrestrialAnimal)
    assert.equal(Amphibian2.breathe(), 'Using my longs to breathe') // Later sources override earlier ones
  })

  it('Blockchain definition using mixins', () => {
    class Blockchain {
      #blocks = new Map()

      constructor(genesis = createGenesisBlock()) {
        this.#blocks.set(genesis.hash, genesis)
      }

      height() {
        return this.#blocks.size
      }

      lookup(hash) {
        const h = hash
        if (this.#blocks.has(h)) {
          return this.#blocks.get(h)
        }
        throw new Error(`Block with hash ${h} not found!`)
      }

      push(newBlock) {
        this.#blocks.set(newBlock.hash, newBlock)
        return newBlock
      }
    }

    function createGenesisBlock(previousHash = '0'.repeat(64)) {
      return new Block(1, previousHash, [])
    }

    Object.assign(Blockchain.prototype, HasValidation())

    const blockchain = new Blockchain()
    assert.equal(blockchain.height(), 1)
    blockchain.push(new Block(2, '123', []))
    assert.equal(blockchain.height(), 2)
  })

  it('Listing 3.8 Block definition', () => {
    class Block {
      #version = '1.0'
      #blockchain

      constructor(index, previousHash, pendingTransactions = []) {
        this.index = index
        this.pendingTransactions = pendingTransactions
        this.previousHash = previousHash
        this.timestamp = Date.now()
        this.hash = this.calculateHash()
      }

      set blockchain(b) {
        this.#blockchain = b
        return this
      }

      isGenesis() {
        return this.previousHash === '0'.repeat(64)
      }
    }

    Object.assign(
      Block.prototype,
      HasHash(['index', 'timestamp', 'previousHash', 'pendingTransactions']),
      HasValidation()
    )
    const blockchain = new Block()
    assert.equal(blockchain.hash.length, 64)
  })

  it('Listing 3.9 Wallet object', () => {
    class Wallet {
      constructor(publicKey, privateKey) {
        this.publicKey = publicKey
        this.privateKey = privateKey
      }
      get address() {
        return this.publicKey
      }
      balance(ledger) {
        //implementation not shown in chapter 3
      }
    }
    const wallet = new Wallet('123', '456')
    assert.equal(wallet.address, '123')
  })
})
