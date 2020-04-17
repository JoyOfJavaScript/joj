import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const { assert } = chai
const fsp = fs.promises

const decode = curry((charset, buffer) => (!buffer ? '' : buffer.toString(charset)))

const tokenize = curry((delimeter, str) => (str || '').split(delimeter))

const count = arr => (!arr ? 0 : arr.length)

describe('8.x - Promises', () => {
    it('countBlocksInFile using standard promises', async () => {
        function countBlocksInFile(file) {
            return fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)
                .then(() => {
                    return fsp.readFile(file)
                })
                .then(decode('utf-8'))
                .then(tokenize(';'))
                .then(count)
                .catch(error => {
                    throw new Error(`File ${file} does not exist or you have 
                      no read permissions. Details: ${error.message}`)
                })
        }

        return countBlocksInFile(path.join(process.cwd(), 'res', 'blocks.txt'))
            .then(result => {
                console.log('Result is: ', result)
                assert.equal(result, 3)
            })
    })

    it('Tests sync array of promises', async () => {
        function delay(value, time) {
            return new Promise(resolve => {
                setTimeout(resolve, time, value)
            })
        }

        for await (const value of [delay('a', 500), delay('b', 100), delay('c', 200)]) {
            console.log(value)
        }
    })

    it('Tests sync array of promises using reduce', () => {
        function delay(value, time) {
            return new Promise(resolve => {
                setTimeout(resolve, time, value)
            })
        }

        return [delay('a', 500), delay('b', 100), delay('c', 200)].reduce(
            (promise, next) => promise.then(() => next).then(console.log), Promise.resolve()
        )
    })

    it('Tests error handling in for..await..of', async () => {

        function delay(value, time, error = false) {
            return new Promise((resolve, reject) => {
                if (error) {
                    reject(new Error("Abrupt error"))
                }
                else {
                    setTimeout(resolve, time, value)
                }
            })
        }

        try {
            for await (const value of [delay('a', 500), delay('b', 100, true), delay('c', 200)]) {
                console.log(value)
            }
        }
        catch (e) {
            assert.equal(e.message, 'Abrupt error')
        }
    })

    it('Async iterator', async () => {

        function delayedIterator(tasks) {
            return {
                next: function () {
                    if (tasks.length) {
                        const [value, time] = tasks.shift()
                        return new Promise(resolve => {
                            setTimeout(resolve, time, { value, done: false })
                        })
                    } else {
                        return Promise.resolve({
                            done: true
                        });
                    }
                }
            };
        }


        const tasks = [
            ['a', 500],
            ['b', 100],
            ['c', 200]
        ]

        const it = delayedIterator(tasks);

        await it.next().then(({ value, done }) => {
            assert.equal(value, 'a')
            assert.isNotOk(done)
        });
        await it.next().then(({ value, done }) => {
            assert.equal(value, 'b')
            assert.isNotOk(done)
        });
        await it.next().then(({ value, done }) => {
            assert.equal(value, 'c')
            assert.isNotOk(done)
        });
        await it.next().then(({ value, done }) => {
            assert.isUndefined(value)
            assert.isOk(done)
        });
    })

    it('Async iterator 2', async () => {

        function delay(value, time) {
            return new Promise(resolve => {
                setTimeout(resolve, time, { value, done: false })
            })
        }
        function delayedIterator(tasks) {
            return {
                next: async function () {
                    if (tasks.length) {
                        const [value, time] = tasks.shift()
                        return await delay(value, time)
                    } else {
                        return Promise.resolve({
                            done: true
                        });
                    }
                }
            };
        }


        const tasks = [
            ['a', 500],
            ['b', 100],
            ['c', 200]
        ]

        const it = delayedIterator(tasks);

        await it.next().then(({ value, done }) => {
            assert.equal(value, 'a')
            assert.isNotOk(done)
        });
        await it.next().then(({ value, done }) => {
            assert.equal(value, 'b')
            assert.isNotOk(done)
        });
        await it.next().then(({ value, done }) => {
            assert.equal(value, 'c')
            assert.isNotOk(done)
        });
        await it.next().then(({ value, done }) => {
            assert.isUndefined(value)
            assert.isOk(done)
        });
    })



    it('countBlocksInFile using chunking', async () => {
        async function countBlocksInFile(file) {
            try {
                await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)

                const dataStream = fs.createReadStream(file,
                    { encoding: 'utf8', highWaterMark: 1024 })

                let previousDecodedData = ''
                let totalBlocks = 0

                for await (const chunk of dataStream) {
                    previousDecodedData += chunk
                    let separatorIndex
                    while ((separatorIndex = previousDecodedData.indexOf(';')) >= 0) {
                        // line includes the ;
                        const decodedData = previousDecodedData.slice(0, separatorIndex + 1)

                        // count blocks in row
                        const blocks = tokenize(';', decodedData).filter(str => str.length > 0)
                        // yield blocks (if generator is used)
                        totalBlocks += count(blocks)
                        console.log(`Adding ${blocks} blocks to count`)
                        previousDecodedData = previousDecodedData.slice(separatorIndex + 1)
                    }
                }
                if (previousDecodedData.length > 0) {
                    totalBlocks += 1
                }
                return totalBlocks
            }
            catch (e) { //#D
                console.error(`Error processing file: ${e.message}`)
                return 0
            }
        }

        const filename = path.join(process.cwd(), 'res', 'blocks.txt')
        const result = await countBlocksInFile(filename)
        console.log('Result is: ', result)
        assert.equal(result, 3)
    })

    it('Pipe operator with async/await', async () => {
        async function countBlocksInFile(file) {
            try {
                await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)
                const data = await fsp.readFile(file)
                const decodedData = decode('utf8', data)
                const blocks = tokenize(';', decodedData)
                return count(blocks)
            } catch (e) {
                throw new Error(`File ${file} does not exist or you have 
                    no read permissions. Details: ${e.message}`)
            }
        }

        const { join, normalize, extname } = path

        function txtResource(strings, resourcePath) {
            const name = strings[1] ?.toLowerCase() ?? throw new Error("Expected non-null filename")
            console.log('extension name', extname(name) ?.toLowerCase())
            const extension = extname(name) ?.toLowerCase() || '.txt'
            return normalize(join(process.cwd(), resourcePath, `${name}${extension}`))
        }

        const resources = 'res'
        const blocks = txtResource`${resources}blocks` |> (await countBlocksInFile)
        assert.equal(await blocks, 3)
        const blocks2 = path.join(process.cwd(), 'res', 'blocks.txt') |> (await countBlocksInFile)
        assert.equal(await blocks2, 3)
    })
})
