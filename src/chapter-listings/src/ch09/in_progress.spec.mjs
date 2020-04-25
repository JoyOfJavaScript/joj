
import { compose, curry, prop } from '@joj/blockchain/util/fp/combinators.js'
import Builders, { Blockchain } from '@joj/blockchain/domain.js'
import { ReactiveExtensions, filter, map, reduce, skip } from './rx.mjs'
import EventEmitter from 'events'
import { Readable } from 'stream'
import chai from 'chai'
import fs from 'fs'
import path from 'path'
import reactivize from './reactivize.mjs'

const { Block: BlockBuilder } = Builders
const { at, linkedTo, withPendingTransactions, withDifficulty, build: buildBlock } = BlockBuilder
const { assert } = chai
const fsp = fs.promises

const tokenize = curry((delimeter, str) => (str || '').split(delimeter))

async function* generateBlocksFromFile(file) {
    try {
        await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)

        const dataStream = fs.createReadStream(file,
            { encoding: 'utf8', highWaterMark: 64 }) //1024

        let previousDecodedData = ''

        for await (const chunk of dataStream) {
            previousDecodedData += chunk
            let separatorIndex
            while ((separatorIndex = previousDecodedData.indexOf(';')) >= 0) {
                // line includes the ;
                const decodedData = previousDecodedData.slice(0, separatorIndex + 1)

                // count blocks in row
                const blocks = tokenize(';', decodedData).filter(str => str.length > 0).map(str => str.replace(';', ''))
                // yield blocks (there might be more than one)
                for (const block of blocks) {
                    yield JSON.parse(block)
                }
                previousDecodedData = previousDecodedData.slice(separatorIndex + 1)
            }
        }
        if (previousDecodedData.length > 0) {
            console.log('Parsing block', previousDecodedData)
            yield JSON.parse(previousDecodedData)
        }
    }
    catch (e) { //#D
        console.error(`Error processing file: ${e.message}`)
        throw e
    }
}

describe('9 - Managing State', () => {

    it('Creates a Reactive Array', done => {
        const square = num => {
            console.log('Squaring:', num)
            return num ** 2
        }
        const isEven = num => {
            console.log('Is even:', num)
            return num % 2 === 0
        }
        let count = 0
        const arr$ = reactivize([1, 2, 3, 4, 5])
        const subs = Observable.from(arr$)
            .filter(isEven)
            .map(square)
            .subscribe({
                next(value) {
                    console.log('Received new value', value)
                    count += value
                }
            })

        assert.equal(count, 20)
        arr$.push(6)
        assert.equal(count, 56)
        subs.unsubscribe()
        done()
    }).timeout(10_000)

    it('@@observable', done => {
        const Pair = (left, right) => ({
            left,
            right,
            [Symbol.observable]() {
                return new Observable(observer => {
                    observer.next(left)
                    observer.next(right)
                    observer.complete()
                })
            }
        })

        Observable.from(Pair(20, 30))
            .subscribe({
                next(value) {
                    console.log('Pair elements: ', value)
                },
                complete() {
                    done()
                }
            })
    })

    it('Pipeable operators with async generator', done => {

        const toUpper = word => word.toUpperCase()

        async function* words() {
            yield 'Start'
            yield 'The'
            yield 'Joy'
            yield 'of'
            yield 'JavaScript'
        }

        Observable.fromGenerator(words()) |> skip(1) |> map(toUpper) |> ($ => $.subscribe({ next: :: console.log, complete: done }))
    })


    it('Error case with Observable', () => {

        const toUpper = word => word.toUpperCase()

        function* words() {
            yield 'The'
            yield 'Joy'
            yield 'of'
            yield null
        }

        Observable.fromGenerator(words())
            .map(toUpper)
            .subscribe({
                next: :: console.log,
                error: ({ message }) => { assert.equal('word.toUpperCase is not a function', message) }
            })
    })


    it('Pipeable operators with random number', done => {

        const square = num => num ** 2
        const isEven = num => num % 2 === 0
        const add = (x, y) => x + y

        function newRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        const randomNum$ = count => new Observable(observer => {
            let i = 0
            const _id = setInterval(() => {
                if (i++ >= count) {
                    observer.complete()
                    clearInterval(_id)
                }
                else {
                    const num = newRandom(1, 10)
                    console.log('New random:', num)
                    observer.next(num);
                }
            }, 500)

            return () => {
                clearInterval(_id)
            }
        })

        randomNum$(3)
            |> filter(isEven)
            |> map(square)
            |> reduce(add, 0)
            |> ($ => $.subscribe({ next: :: console.log, complete: done }))

    }).timeout(10_000)

    it('Pipeable operators', done => {

        const square = num => num ** 2
        const isEven = num => num % 2 === 0
        const add = (x, y) => x + y

        Observable.of(1, 2, 3, 4) |> skip(1) |> filter(isEven) |> map(square) |> reduce(add, 0) |> ($ => $.subscribe({ next: :: console.log, complete: done }))

    })

    it('Pipeable operators with bind syntax', done => {

        const { skip, map, filter, reduce } = ReactiveExtensions;

        const square = num => num ** 2
        const isEven = num => num % 2 === 0
        const add = (x, y) => x + y

        const subs = Observable.of(1, 2, 3, 4) 
            :: skip(1) 
            :: filter(isEven) 
            :: map(square) 
            :: reduce(add, 0)

        subs.subscribe({
            next(value) {
                console.log('In bind operator, value is', value)
                assert.equal(value, 20)
            },
            complete() {
                done()
            }
        })
    })

    it('Observable and Observer', () => {
        new Observable(observer => {
            observer.next('hello');
            observer.next('world');
            observer.complete();
        }).subscribe({
            next(it) { console.log(it); },
            complete() { console.log('!'); }
        })
    })

    it('Tests Observable basic functionality', () => {
        const obs = new Observable(observer => {
            for (const i of [1, 2, 3]) {
                observer.next(i)
            }
        })
        obs.subscribe({
            next: number => {
                console.log('Seeing number: ', number)
                assert.isNumber(number)
            },
            error: error => {
                console.log(error.message)
            },
            complete: () => {
                console.log('Done!')
            }
        })
    })

    it('Tests random number generator', done => {

        function newRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        const randomNum$ = new Observable(observer => {
            const _id = setInterval(() => {
                observer.next(newRandom(1, 10));
            }, 100)

            return () => {
                clearInterval(_id)
            }
        });

        const isEven = num => num % 2 === 0
        const add = (x, y) => x + y
        const square = num => num ** 2

        const subs = randomNum$
            .filter(isEven)
            .map(square)
            .buffer(10)
            .map(arr => arr.reduce(add, 0))
            .subscribe({
                next(number) {
                    console.log('Getting sum: ', number)
                },
                complete() {
                    done()
                }
            })

        // unsubscribe after 5 seconds
        setTimeout(() => {
            subs.unsubscribe();
            done()
        }, 5_000)
    }).timeout(6_000)

    it('countBlocksInFile using a generator', async () => {

        const filename = path.join(process.cwd(), 'res', 'blocks.txt')
        let result = 0
        for await (const block of generateBlocksFromFile(filename)) {
            console.log('Counting block', block.hash)
            result++
        }
        console.log('Result is: ', result)
        assert.equal(result, 3)

        let validBlocks = 0
        const chain = new Blockchain()
        let skippedGenesis = false
        for await (const blockData of generateBlocksFromFile(filename)) {
            if (!skippedGenesis) {
                skippedGenesis = true
                continue
            }
            const block = {}
                :: at(blockData.index)
                :: linkedTo(chain.top.hash)
                :: withPendingTransactions(blockData.data)
                :: withDifficulty(blockData.difficulty)
                :: buildBlock()
            chain.push(block)

            if (block.validate().isFailure) {
                break
            }
            validBlocks++
        }
        assert.equal(validBlocks, 2)
    })

    it('Test Observable with skip, filter, and map', done => {
        const square = num => num ** 2
        const isEven = num => num % 2 === 0

        Observable.of(1, 2, 3)
            .skip(1)
            .filter(isEven)
            .map(square)
            .subscribe({
                next(value) {
                    assert.equal(value, 4)
                },
                complete() {
                    done()
                }
            })
    })

    it('Test Observable with skip, filter, map, and reduce', done => {
        const square = num => num ** 2
        const isEven = num => num % 2 === 0
        const add = (x, y) => x + y

        Observable.of(1, 2, 3, 4)
            .skip(1)
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



    it('Observable.of The Joy of JavaScript', done => {
        Observable.of('The', 'Joy', 'of', 'JavaScript')
            .subscribe({
                next: console.log,
                complete: done
            })
    })

    it('Observable.from The Joy of JavaScript generator', done => {
        function* words() {
            yield 'The'
            yield 'Joy'
            yield 'of'
            yield 'JavaScript'
            yield 'From Generator'
        }

        Observable.fromGenerator(words())
            .subscribe({
                next: :: console.log,
                complete: done
            })
    })

    it('Observable.from The Joy of JavaScript async generator', done => {
        async function* words() {
            yield 'The'
            yield 'Joy'
            yield 'of'
            yield 'JavaScript'
            yield 'From Async Generator'
        }

        Observable.fromGenerator(words())
            .subscribe({
                next: :: console.log,
                complete: done
            })
    })


    it('Observable with standalone operators', done => {
        let result = 0;

        function newRandom(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }

        const randomNum$ = new Observable(observer => {
            const _id = setInterval(() => {
                observer.next(newRandom(1, 10));
            }, 100)

            return () => {
                clearInterval(_id)
            }
        });

        const square = num => num ** 2
        const subs = map(square, randomNum$)
            .subscribe({
                next(randomNumber) {
                    result += randomNumber
                }
            })

        setTimeout(() => {
            subs.unsubscribe()
            console.log('Observable with standalone operators using random numbers: ', result)
            assert.isOk(result > 0)
            done()
        }, 3_000)
    }).timeout(5_000)

    it('Observable with composed, standalone  operators', done => {
        let result = 0;

        const square = num => num ** 2

        map(square, Observable.of(1, 2, 3))
            .subscribe({
                next(randomNumber) {
                    result += randomNumber  // 1 + 4 + 9 = 14
                },
                complete() {
                    console.log('Observable with standalone operators: ', result)
                    assert.equal(result, 14)
                    done()
                }
            })
    }).timeout(5_000)

    it('Observable with composed, standalone  operators', done => {
        let result = 0;
        const square = num => num ** 2
        const add = curry((x, y) => x + y)
        const subs = map(square, map(add(1), Observable.of(1, 2, 3)))
            .subscribe({
                next(number) {
                    result += number  // 4 + 9 + 16 = 29
                },
                complete() {
                    console.log('Observable with composed, standalone operators: ', result)
                    assert.equal(result, 29)
                    done()
                }
            })
        subs.unsubscribe()
    }).timeout(5_000)

    it('Test Observable from Generator', done => {

        function* numbers() {
            let i = 0
            while (i < 3) {
                yield i++
            }
        }

        let nums = 0
        const sub = Observable.fromGenerator(numbers())
            .map(num => {
                console.log('Seeing numner', num)
                return num
            })
            .subscribe({
                next(value) {
                    nums++
                }
            })
        setTimeout(() => {
            sub.unsubscribe()
            assert.isOk(nums > 0)
            done()
        }, 1000)
    })

    it('Test Observables are lazy', done => {

        const filename = path.join(process.cwd(), 'res', 'blocks.txt')
        let called = false
        const stream = Observable.fromGenerator(generateBlocksFromFile(filename))
            .skip(1)
            .map(block => {
                console.log('Saw block', block.hash)
                called = true
            })
        assert.isNotOk(called)

        stream.subscribe({
            next() {
                called = true
            },
            complete() {
                assert.isOk(called)
                done()
            }
        })
    })

    it('Validating a stream of blocks using Observable', done => {

        const filename = path.join(process.cwd(), 'res', 'blocks.txt')

        const chain = new Blockchain()
        const validateBlock = block => block.validate()
        const validationToNumber = validation => Number(validation.isSuccess)
        const add = (x, y) => x + y

        const addBlockToChain = curry((chain, blockData) => {
            const block = Object.create(BlockBuilder)
                .at(blockData.index)
                .linkedTo(chain.top.hash)
                .withPendingTransactions(blockData.data)
                .withDifficulty(blockData.difficulty)
                .build()
            return chain.push(block)
        })

        Observable.fromGenerator(generateBlocksFromFile(filename))
            .skip(1)
            .map(addBlockToChain(chain))
            .map(validateBlock)
            .filter(prop('isSuccess'))
            .map(validationToNumber)
            .reduce(add, 0)
            .subscribe({
                next(validBlocks) {
                    assert.equal(validBlocks, 2)
                    console.log('Valid blocks: ', validBlocks)
                    if (validBlocks === chain.height() - 1) {
                        console.log('All blocks are valid!')
                    }
                },
                error(error) {
                    console.log(error)
                },
                complete() {
                    console.log('Done validating block stream!')
                    done()
                }
            })
    })


    it('Validating a stream of blocks using Observable with compose', done => {

        const filename = path.join(process.cwd(), 'res', 'blocks.txt')

        const chain = new Blockchain()
        const validateBlock = block => block.validate()
        const add = (x, y) => x + y
        const validationToNumber = validation => Number(validation.isSuccess)

        const addBlockToChain = curry((chain, blockData) => {
            const block = Object.create(BlockBuilder)
                .at(blockData.index)
                .linkedTo(chain.top.hash)
                .withPendingTransactions(blockData.data)
                .withDifficulty(blockData.difficulty)
                .build()
            return chain.push(block)
        })

        Observable.fromGenerator(generateBlocksFromFile(filename))
            .skip(1)
            .map(compose(validateBlock, addBlockToChain(chain)))
            .filter(prop('isSuccess'))
            .map(validationToNumber)
            .reduce(add, 0)
            .subscribe({
                next(validBlocks) {
                    assert.equal(validBlocks, 2)
                    console.log('Valid blocks: ', validBlocks)
                    if (validBlocks === chain.height() - 1) {
                        console.log('All blocks are valid!')
                    }
                    else {
                        console.log('Detected validation error in chain')
                    }
                },
                error(error) {
                    console.log(error)
                },
                complete() {
                    console.log('Done validating block stream!')
                    done()
                }
            })
    })

    it('Creates a lazy push Array', done => {

        class PushArray extends Array {

            static EVENT_NAME = 'new_value'

            #eventEmitter = new EventEmitter();

            constructor(...values) {
                super(...values)
            }

            push(value) {
                this.#eventEmitter.emit(PushArray.EVENT_NAME, value)
                return super.push(value)
            }

            subscribe({ next }) {
                this.#eventEmitter.on(PushArray.EVENT_NAME, value => {
                    next(value)
                })
            }

            unsubscribe() {
                this.#eventEmitter.removeAllListeners(PushArray.EVENT_NAME)
            }

            async *[Symbol.asyncIterator]() {

                this.unsubscribe()
                for (const value of this) {
                    yield value
                }
                while (true) {
                    if (this.#eventEmitter.listenerCount(this.constructor.EVENT_NAME) === 0) {  //     Uncaught Error: Class "PushArray" cannot be referenced in computed property keys.
        break
    }
    yield new Promise(resolve => {
        this.#eventEmitter.once(this.constructor.EVENT_NAME, resolve)
    })
}
            }
        }

const arr = new PushArray(1, 2, 3)
assert.deepEqual([1, 4, 9], arr.map(x => x ** 2))
arr.subscribe({  // If I do this, I will have to unsubscribe in asyncIterator
    next(value) {
        assert.equal(value, 4)
    }
})
arr.push(4)
assert.deepEqual([1, 2, 3, 4], arr)

const vals = []
Readable
    .from(arr)
    .on('data', value => {
        vals.push(value)
    })
    .on('end', () => {
        assert.deepEqual([1, 2, 3, 4], vals)
        arr.unsubscribe()
        arr.push(5)
        assert.deepEqual([1, 2, 3, 4, 5], arr)
        done()
    })
    }).timeout(10_000)
})