//@flow

// Silences Flow for these types
declare var describe: any
declare var it: any
declare var Observable: any

import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import type { Difficulty } from '@joj/blockchain/domain/Block.js.flow'
import chai from 'chai'

const { assert } = chai

describe('10.3.2 - Interface types', () => {
    // You can find partial type definitions for the Blockchain classes (Block, Blockchain, Transaction)
    // in the blockchain project: 
    // @joj/blockchain/domain/Block.js.flow
    // @joj/blockchain/domain/Blockchain.js.flow
    // @joj/blockchain/domain/Transaction.js.flow
    // @joj/blockchain/domain/value/Money.js.flow
    // @joj/blockchain/util/fp/data/validation2/validation.js.flow

    it('Shows Partial Block class example with Serializable', () => {

        interface Serializable {
            toJson(): string
        }

        class MyBlock implements Serializable {
            index: number = 0
            previousHash: string
            timestamp: number
            difficulty: Difficulty
            data: Array<mixed>
            nonce: number
            constructor(index: number, previousHash: string, data: Array<mixed> = [], difficulty: Difficulty = 0) {
                this.index = index
                this.previousHash = previousHash
                this.data = data
                this.nonce = 0
                this.difficulty = difficulty
                this.timestamp = Date.now()
            }

            /**
             * Check whether this block is a genesis block (first block in a any chain)
             * @return {Boolean} Whether this is a genesis block
             */
            isGenesis(): boolean {
                return this.previousHash === '0'.repeat(64)
            }

            isValid(): Success<MyBlock> | Failure {
                return Success.of(this)
            }

            toJson() {
                return JSON.stringify(this)
            }
        }
        const block: MyBlock = new MyBlock(1, '0'.repeat(64), ['a', 'b', 'c'], 1)
        assert.isOk(block.isGenesis())
    })
})