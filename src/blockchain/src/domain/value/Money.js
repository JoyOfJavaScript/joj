import { compose, composeM, curry } from '~util/fp/combinators.js'
import { currencyMatch, isNumber, notNaN } from './money/validations.js'
import Validation from '~util/fp/data/validation2/validation.js'
import precisionRound from './money/precision_round.js'

export const US_DOLLAR = '$'
export const BTC = '₿'

/**
 * Money value object
 *
 * @param {string} currency Type of currency (default: bitcoin)
 * @param {string} amount   Amount represented
 * @return {Money} Returns a money object
 */
const Money = curry((currency, amount) =>
  compose(
    Object.seal,
    Object.freeze
  )(Object.assign(Object.create(null),
    {
      amount,
      currency,
      equals: other => currency === other.currency && amount === other.amount,
      inspect: () => `${currency} ${amount}`,
      serialize: () => JSON.stringify({ amount, currency }),
      round: (precision = 2) => Money(currency, precisionRound(amount, precision)),
      minus: m => Money(currency, amount - m.amount),
      plus: m => Money(currency, amount + m.amount),
      times: m => Money(currency, amount * m.amount),
      compareTo: other => amount - other.amount,
      asNegative: () => Money(currency, amount * -1),
      valueOf: () => precisionRound(amount, 2),
      toString: () => `${currency}${amount}`,
      [Symbol.toPrimitive]: () => precisionRound(amount, 2),
      [Symbol.toStringTag]: `${currency}${amount}`
    }
  ))
)

/*
const obj2 = Object.create(null);
console.log(obj2.__proto__)              // undefined
console.log(Object.getPrototypeOf(obj2)) // null
*/

// Zero
Money.zero = (currency = BTC) => Money(currency, 0)
Money.Currencies = {
  [US_DOLLAR]: 'USD',
  [BTC]: 'Bitcoin'
}
Money.round = m => m.round()

// Compare money objects
Money.compare = (m1, m2) => {
  if (currencyMatch(m1, m2).isFailure) {
    throw new Error(`Current mismatch ${m1.currency} != ${m2.currency}`)
  }
  return m1.compareTo(m2)
}

// Add two money objects
Money.sum = (m1, m2) =>
  Validation.of(x => m1.plus(m2))
    .ap(currencyMatch(m1, m2))
    .flatMap(validateAmount)
    .get()

// Subtract two Money objects
Money.subtract = (m1, m2) =>
  Validation.of(x => m1.minus(m2))
    .ap(currencyMatch(m1, m2))
    .get()

Money.multiply = (m1, m2) =>
  Validation.of(x => m1.times(m2))
    .ap(currencyMatch(m1, m2))
    .get()

// Language extension for Number.prototype
if (typeof Number.prototype.bitcoin !== 'function') {
  // Must be:
  // - writable: false
  // - enumerable: false
  // - configurable: false
  Object.defineProperty(Number.prototype, 'btc', {
    value: function Bitcoin() {
      return Money(BTC, this)
    },
    writable: false,
    configurable: false
  })
}


const validateAmount = composeM(isNumber, notNaN)

export default Money
