import chai from 'chai'

const { assert } = chai

export const BITCOIN = '₿'
export const US_DOLLAR = '$'

const Money = (currency = BITCOIN, amount = 0) => ({
  amount,
  currency,
  constructor: Money,
  equals: other => Object.is(currency, other.currency) && Object.is(amount, other.amount),
  inspect: () => `${currency} ${amount}`,
  serialize: () => JSON.stringify({ amount, currency }),
  round: (precision = 2) => Money(currency, precisionRound(amount, precision)),
  minus: m => Money(currency, amount - m.amount),
  plus: m => Money(currency, amount + m.amount),
  times: m => Money(currency, amount * m.amount),
  compareTo: other => amount - other.amount,
  asNegative: () => Money(currency, amount * -1),
  [Symbol.toPrimitive]: () => precisionRound(amount, 2),
  [Symbol.hasInstance]: i => i.constructor.name === 'Money'
})

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

describe('Bind proposal', () => {
  it('prop', () => {
    const prop = Object.prototype.hasOwnProperty
    const obj = {}
    assert.equal(prop.call(obj, 'x'), false)
    obj.x = 100
    assert.equal(prop.call(obj, 'x'), true)
    assert.equal(obj::prop('x'), true)
  })
  it('map', () => {
    function map(fn) {
      return this && fn(this)
    }

    function add2(num) {
      return num + 2
    }
    const result = 5::map(add2)::map(add2)
    assert.equal(result, 9)
  })

  it('Money', () => {
    function map(fn) {
      return this && fn(this)
    }

    function numToUsd(num) {
      return Money(US_DOLLAR, num)
    }

    function toBitcoin(money) {
      return Money(BITCOIN, money.amount * 0.00028)
    }

    const result = 10::map(numToUsd)::map(toBitcoin)
    assert.equal(result.amount, 0.0027999999999999995)
  })

  it('Extracts from Array', () => {
    const { map, filter, reduce } = Array.prototype

    const result = [1, 2, 3]
      ::filter(n => n % 2 === 0)
      ::map(n => n ** 2)
      ::reduce((a, b) => a + b, 0)

    assert.equal(result, 4)
  })
})
