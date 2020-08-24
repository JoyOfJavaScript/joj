//@flow

// Silences Flow for these types
declare var describe: any
declare var it: any
declare var Observable: any

import '../ch09/rx.mjs'
import chai from 'chai'

const { assert } = chai

describe('10.3.5 - Generic ty[es', () => {
    // You can find partial type definitions for the Blockchain classes (Block, Blockchain, Transaction)
    // in the blockchain project: 
    // @joj/blockchain/domain/Block.js.flow
    // @joj/blockchain/domain/Blockchain.js.flow
    // @joj/blockchain/domain/Transaction.js.flow
    // @joj/blockchain/domain/value/Money.js.flow
    // @joj/blockchain/util/fp/data/validation2/validation.js.flow

    it('Listing 10.3 Typed Observable contracts', done => {

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
})