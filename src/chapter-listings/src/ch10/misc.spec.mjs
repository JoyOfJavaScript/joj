//@flow

// Silences Flow for these types
declare var describe: any
declare var it: any
declare var Observable: any

import './rx.mjs'
import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import Block from '@joj/blockchain/domain/Block.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import type { Difficulty } from '@joj/blockchain/domain/Block.js.flow'
import Key from '@joj/blockchain/domain/value/Key.js'
import Money from '@joj/blockchain/domain/value/Money.js'
import Transaction from '@joj/blockchain/domain/Transaction.js'
import chai from 'chai'

const { assert } = chai


describe('10 - Typed JavaScript<T>', () => {

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


    it('Shows variable Block with type information', () => {
        const block: Block = new Block(1, '0'.repeat(64), [], 2)
        assert.isNotNull(block)
        assert.equal(block.previousHash, '0'.repeat(64))
    })

    it('Shows variable Transaction with type information', () => {
        const fromKey: any = Key('test-public.pem')
        const toKey: any = Key('test-public.pem')
        const privateKey: any = Key('test-private.pem')
        const transaction: Transaction = new Transaction(fromKey, toKey, Money('USD', 30), 'Money transfer')
        transaction.signTransaction(privateKey)
        assert.isNotEmpty(transaction.signature)
    })

    it('Shows Blockchain type with Validation', () => {
        const chain: Blockchain = new Blockchain()
        let top: Block = chain.push(new Block(chain.height() + 1, chain.top.hash, []))
        assert.equal(top.index, 2)
        top = chain.push(new Block(chain.height() + 1, chain.top.hash, []))
        assert.equal(top.index, 3)
        const validation: Success<boolean> | Failure = chain.validate()
        assert.isOk(validation.map)
        assert.isOk(validation.isSuccess)
        assert.isNotOk(validation.isFailure)
    })

    it('Shows Block class example', () => {

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

    it('Shows Money', () => {
        const money = Money('₿', 0.1)
        assert.equal(money.currency, '₿')

        type MoneyT = (currency: string, amount: number) => { currency: string, amount: number }

        const Bitcoin: MoneyT = (currency, amount) => ({ currency, amount })
        const btc = Bitcoin('₿', 0.1)
        assert.equal(btc.currency, '₿')
    })

    it('Combining map, filter, reduce', done => {

        type Observer<T> = {
            next: (value: T) => void,
            error?: (error: Error) => void,
            complete?: () => void
        }

        interface IObservable<T> {
            skip(count: number): IObservable<T>;
            filter(predicate: T => boolean): IObservable<T>;
            map<Z>(fn: T => Z): IObservable<Z>;
            reduce<Z>(acc: (
                accumulator: Z,
                value: T,
                index?: number,
                array?: Array<T>
            ) => Z, startwith?: T): IObservable<T>;
            subscribe(observer: Observer<T>): ISubscription;
        }

        interface ISubscription {
            unsubscribe(): void;
        }

        const square = num => num ** 2
        const isEven = num => num % 2 === 0
        const add = (x, y) => x + y
        const toUpper = x => x.toUpperCase()

        const numbers: IObservable<number> = Observable.of(1, 2, 3, 4)

        numbers.skip(1)
            .filter(isEven)
            .map(square)
            .reduce(add, 0)
            .subscribe({
                next(value) {
                    assert.equal(value, 20)
                },
                complete() {
                    done()
                }
            })
    })

    it('Shows Validaton.map', () => {
        const success: Success<number> = Success.of(2)
        assert.equal(success.map(x => x + 1).map(x => x ** 2).get(), 9)

    })
})