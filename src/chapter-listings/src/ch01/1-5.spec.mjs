import Blockchain from '@joj/blockchain/domain/Blockchain.js'

import chai from 'chai'

const { assert } = chai

describe('1.5 - Separating concerns like a pro', () => {
  it('Perf counter using proxy', () => {
    let time = 0
    const perfCountHandler = (...names) => {
      return {
        get(target, key) {
          if (names.includes(key)) {
            const start = process.hrtime()
            const result = Reflect.get(target, key)
            const end = process.hrtime(start)
            time = end[1] / 1000000
            console.info('Execution time: %ds %dms', end[0], time)
            return result
          }
          return Reflect.get(target, key)
        }
      }
    }

    const handler = perfCountHandler('validate')

    const blockchain = new Proxy(new Blockchain(), handler)
    blockchain.validate()
    assert.isOk(time > 0)
  })
})
