import { Failure, Success } from '@joj/blockchain/util/fp/data/validation2/validation.js'
import { compose, curry, isFunction } from '@joj/blockchain/util/fp/combinators.js'
import Block from '@joj/blockchain/domain/Block.js'
import chai from 'chai'

const { assert } = chai

function dateFormat(date) {
  return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
}

describe('7.6 - Dynamic introspection and reflection', () => {
  it('7.6.1 - Proxy', () => {


    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    }

    const credentials = {
      username: '@luijar',
      password: 'Som3thingR@ndom',
      login: () => {
        console.log('Logging in...')
      }
    }


    const traceLogHandler = {
      get(target, key) {
        console.log(`${dateFormat(new Date())} [TRACE] Calling: `, key)
        return target[key]
      },

    }


    const credentials$Proxy = new Proxy(credentials, traceLogHandler)

    console.log(credentials$Proxy);

    credentials$Proxy.login()
    credentials$Proxy.username
    credentials$Proxy.password

    const passwordObfuscatorHandler = {
      get(target, key) {
        if (key === 'password' || key === 'pwd') {
          return '\u2022'.repeat(randomInt(5, 10))
        }
        return target[key]
      },
      has(target, key) {
        if (key === 'password' || key === 'pwd') {
          return false
        }
        return true
      }
    }

    const credentials$Proxy2 = new Proxy(credentials, passwordObfuscatorHandler)

    assert.isOk(credentials$Proxy2.password.includes('\u2022'))
    assert.isNotOk('password' in credentials$Proxy2)

    const credentials$Proxy3 =
      new Proxy(
        new Proxy(credentials,
          passwordObfuscatorHandler),
        traceLogHandler
      )

    assert.isOk(credentials$Proxy3.password.includes('\u2022'))
    const weave = curry((handler, target) => {
      return new Proxy(target, handler)
    })

    const tracer = weave(traceLogHandler)
    const obfuscator = weave(passwordObfuscatorHandler)

    const credentials$Proxy4 = compose(tracer, obfuscator)(credentials)

    const credentials$Proxy5 = credentials |> obfuscator |> tracer
    assert.isOk(credentials$Proxy4.password.includes('\u2022'))
    assert.isOk(credentials$Proxy5.password.includes('\u2022'))

    console.log(credentials$Proxy4.password);
  })

  it('Smart block', () => {
    const block = new Block(1, '123', [])
    assert.equal(block.previousHash, '123')
    assert.equal(block.hash, block.calculateHash());
    const oldHash = block.hash
    const autoHashHandler = (...props) => ({
      set(hashable, key) {
        if (props.includes(key) && !isFunction(hashable[key])) {
          Reflect.set(...arguments)
          Reflect.set(hashable, 'hash',
            Reflect.apply(hashable['calculateHash'], hashable, [])
          )
          return true
        }
      }
    })
    const smartBlock = new Proxy(block, autoHashHandler('index', 'timestamp', 'previousHash', 'nonce', 'data'))
    assert.equal(smartBlock.hash, oldHash);
    smartBlock.data = ['foo']
    assert.notEqual(smartBlock.hash, oldHash);
    assert.equal(smartBlock.hash, smartBlock.calculateHash());
  })
})
