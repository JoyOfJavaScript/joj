import Block from '@joj/blockchain/domain/Block.js'
import chai from 'chai'

const { assert } = chai

function createGenesisBlock(previousHash = '0'.repeat(64)) {
  return new Block(1, previousHash, [])
}

describe('3.2.1 - Explicit Delegation', () => {
  it('Listing 3.2 Explicit delegation from Blockchain to its internal array store', () => {
    class Blockchain {
      #blocks = []

      constructor(genesis = createGenesisBlock()) {
        this.#blocks.push(genesis)
      }

      height() {
        return this.#blocks.length
      }

      lookup(hash) {
        for (const b of this.#blocks) {
          if (b.hash === hash) {
            return b
          }
        }
        throw new Error(`Block with hash ${hash} not found!`)
      }

      push(newBlock) {
        this.#blocks.push(newBlock)
        return newBlock
      }
    }

    const blockchain = new Blockchain()
    assert.equal(blockchain.height(), 1)
  })

  it('Shows a version of Blockchain based on an internal Map', () => {
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
    const blockchain = new Blockchain()
    assert.equal(blockchain.height(), 1)
  })
})
