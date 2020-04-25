import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'
import fs from 'fs'
import path from 'path'

const fsp = fs.promises
const { assert } = chai

function delay(value, time) {
  return new Promise(resolve => {
    setTimeout(resolve, time, value)
  })
}

const tokenize = curry((delimeter, str) => (str || '').split(delimeter))
const count = arr => (!arr ? 0 : arr.length)

describe('8.5 - Async iteration', () => {
  it('Async calls out of order', () => {

    const result = []
    const { push } = result

    return new Promise(resolve => {
      for (const p of [delay('a', 500), delay('b', 100), delay('c', 200)]) {
        p.then(result :: push)
      }
      const id = setInterval(() => {
        if (result.length >= 3) {
          assert.deepEqual(['b', 'c', 'a'], result)
          clearInterval(id)
          resolve('Done')
        }
      }, 500)
    })
  })

  it('Ordering async calls using reduce', () => {
    const result = []
    const { push } = result

    const p = [delay('a', 500), delay('b', 100), delay('c', 200)]
      .reduce(
        (chain, next) => chain.then(() => next).then(result :: push),//#A      
        Promise.resolve() //#B
      )

    return p.then(() => {
      assert.deepEqual(['a', 'b', 'c'], result)
    })
  })

  it('Ordering async calls using for await ... const', async () => {
    const result = []

    for await (const value of [delay('a', 500), delay('b', 100), delay('c', 200)]) {
      result.push(value)
    }
    assert.deepEqual(['a', 'b', 'c'], result)
  })

  it('Listing 8.5 Count blocks in files of any size', async () => {
    async function countBlocksInFile(file) {
      try {
        await fsp.access(file, fs.constants.F_OK | fs.constants.R_OK)

        const dataStream = fs.createReadStream(file,  //#A
          { encoding: 'utf8', highWaterMark: 64 }) //#B

        let previousDecodedData = ''
        let totalBlocks = 0

        for await (const chunk of dataStream) { //#C
          previousDecodedData += chunk
          let separatorIndex
          while ((separatorIndex = previousDecodedData.indexOf(';')) >= 0) {
            const decodedData =
              previousDecodedData.slice(0, separatorIndex + 1) //#D

            const blocks = tokenize(';', decodedData)
              .filter(str => str.length > 0)

            totalBlocks += count(blocks)

            previousDecodedData =
              previousDecodedData.slice(separatorIndex + 1) //#E
          }
        }
        if (previousDecodedData.length > 0) {
          totalBlocks += 1
        }
        return totalBlocks
      }
      catch (e) {
        console.error(`Error processing file: ${e.message}`)
        return 0
      }
    }
    const filename = path.join(process.cwd(), 'res', 'blocks.txt')
    const result = await countBlocksInFile(filename)
    console.log('Result is: ', result)
    assert.equal(result, 3)
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
      }
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
})
