//@flow

// Silences Flow for these types
declare var describe: any
declare var it: any
declare var Observable: any

import Block from '@joj/blockchain/domain/Block.js'
import type { Difficulty } from '@joj/blockchain/domain/Block.js.flow'
import chai from 'chai'

const { assert } = chai

describe('10.1.2 - Benefits and drawbacks of using statically-typed JavaScript', () => {
  // You can find partial type definitions for the Blockchain classes (Block, Blockchain, Transaction)
  // in the blockchain project: 
  // @joj/blockchain/domain/Block.js.flow
  // @joj/blockchain/domain/Blockchain.js.flow
  // @joj/blockchain/domain/Transaction.js.flow
  // @joj/blockchain/domain/value/Money.js.flow
  // @joj/blockchain/util/fp/data/validation2/validation.js.flow

  it('proofOfWork with type information', async () => {
    const proofOfWork = (block: Block): Block => {
      const hashPrefix: string = ''.padStart(block.difficulty, '0')
      do {
        block.nonce += nextNonce() //#A
        block.hash = block.calculateHash()
      } while (!block.hash.toString().startsWith(hashPrefix))
      return block
    }

    function nextNonce(): number {
      return randomInt(1, 10) + Date.now()
    }

    function randomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min)) + min
    }

    const diff: Difficulty = 2
    const block: Block = new Block(1, '1234'.repeat(16), ['tx1', 'tx2', 'tx3'], diff)
    proofOfWork(block)
    assert.isOk(block.nonce > 0)
  })
})