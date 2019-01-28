import { expect } from 'chai'

export const BITCOIN = '₿'
export const US_DOLLAR = '$'

const Money = (currency = BITCOIN, amount = 0) => ({
  amount,
  currency,
  constructor: Money,
  equals: other =>
    Object.is(currency, other.currency) && Object.is(amount, other.amount),
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
    expect(prop.call(obj, 'x')).to.be.equal(false)
    obj.x = 100
    expect(prop.call(obj, 'x')).to.be.equal(true)
    expect(obj::prop('x')).to.be.equal(true)
  })
  it('map', () => {
    function map (fn) {
      return this && fn(this)
    }

    function add2 (num) {
      return num + 2
    }
    const result = 5::map(add2)::map(add2)
    expect(result).to.be.equal(9)
  })

  it('Money', () => {
    function map (fn) {
      return this && fn(this)
    }

    function numToUsd (num) {
      return Money(US_DOLLAR, num)
    }

    function toBitcoin (money) {
      return Money(BITCOIN, money.amount * 0.00028)
    }

    const result = 10::map(numToUsd)::map(toBitcoin)
    expect(result.amount).to.be.equal(0.0027999999999999995)
  })

  it('Extracts from Array', () => {
    const { map, filter, reduce } = Array.prototype

    const result = [1, 2, 3]
      ::filter(n => n % 2 === 0)
      ::map(n => n ** 2)
      ::reduce((a, b) => a + b, 0)

    expect(result).to.be.equal(4)
  })
})
