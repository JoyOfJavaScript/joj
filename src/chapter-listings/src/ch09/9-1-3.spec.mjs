import Block from '@joj/blockchain/domain/Block.js'
import Builders from '@joj/blockchain/domain.js'
import Key from '@joj/blockchain/domain/value/Key.js'
import Money from '@joj/blockchain/domain/value/Money.js'
import chai from 'chai'

const { assert } = chai

const { Transaction2: TransactionBuilder } = Builders

const { from, to, having, withDescription, signWith, build: buildTransaction } = TransactionBuilder


describe('9.1.3 - Examples', () => {
  it('Shows iterating through a blocks data', async () => {
    const block = new Block(1, '0'.repeat(64), [1, 2, 3])
    let result = 0;
    for (const tx of block) {
      result += tx
    }
    assert.equal(result, 6)
  })

  it('Shows HasValidation on block', async () => {
    const privateKey = Key('test-private.pem')
    const publicKey = Key('test-public.pem')

    const tx1 = new Builders.Transaction()
      .from(publicKey)
      .to('luke')
      .having(Money('₿', 0.1))
      .withDescription('Test')
      .signWith(privateKey)
      .build()

    const tx2 = new Builders.Transaction()
      .from(publicKey)
      .to('ana')
      .having(Money('₿', 0.9))
      .withDescription('Test 2')
      .signWith(privateKey)
      .build()

    const block = new Block(1, '0'.repeat(64), [tx1, tx2])
    assert.isOk(block.validate().isSuccess)
  })

  it('Shows HasValidation on block with builder pattern', async () => {
    const privateKey = Key('test-private.pem')
    const publicKey = Key('test-public.pem')

    const tx1 = {}
      :: from(publicKey)
      :: to('luke')
      :: having(Money('₿', 0.1))
      :: withDescription('Test')
      :: signWith(privateKey)
      :: buildTransaction()

    const tx2 = {}
      :: from(publicKey)
      :: to('ana')
      :: having(Money('₿', 0.9))
      :: withDescription('Test 2')
      :: signWith(privateKey)
      :: buildTransaction()

    const block = new Block(1, '0'.repeat(64), [tx1, tx2])
    assert.isOk(block.validate().isSuccess)
  })

  it('Listing 9.1 Custom random iterator', async () => {
    function randomNumberIterator(size = 1) {

      function nextRandomInteger(min) { //#A
        return function (max) {
          return Math.floor(Math.random() * (max - min)) + min
        }
      }

      const numbers = Array(size) //#B
        .fill(1)
        .map(min => nextRandomInteger(min)(Number.MAX_SAFE_INTEGER))

      return {
        next() {
          if (numbers.length === 0) {
            return { done: true }  // #C
          }
          return { value: numbers.shift(), done: false } // #D
        }
      }
    }

    const it = randomNumberIterator(3)

    assert.isOk(it.next().value > 0)  // 1334873261721158
    assert.isOk(it.next().value > 0)  // 6969972402572387
    assert.isOk(it.next().value > 0)  // 3915714888608040
    assert.isOk(it.next().done)   // true
  })

  it('Iterable object', async () => {
    function randomNumberIterator(size = 1) {

      function nextRandomInteger(min) { //#A
        return function (max) {
          return Math.floor(Math.random() * (max - min)) + min
        }
      }

      const numbers = Array(size) //#B
        .fill(1)
        .map(min => nextRandomInteger(min)(Number.MAX_SAFE_INTEGER))

      return {
        [Symbol.iterator]() {
          return this //#A
        },
        next() {
          if (numbers.length === 0) {
            return { done: true }
          }
          return { value: numbers.shift(), done: false }
        }
      }

    }

    const it = randomNumberIterator(3)

    assert.isOk(it.next().value > 0)  // 1334873261721158
    assert.isOk(it.next().value > 0)  // 6969972402572387
    assert.isOk(it.next().value > 0)  // 3915714888608040
    assert.isOk(it.next().done)   // true

    for (const num of randomNumberIterator(3)) {
      console.log(num)
    }

    assert.isOk([...randomNumberIterator(3)].length > 0)

  })

  it('Count words using iterator', () => {
    let result = 0;
    for (const word of "Joy of JavaScript") {
      assert.isOk(word.length > 0)
      result++
    }
    assert.equal(result, 17)
  })
})