import { compose, composeM, curry } from '~util/fp/combinators.mjs'
import { currencyMatch, isNumber, notNaN } from './money/validations.mjs'
import Validation from '~util/fp/data/validation2/validation.mjs'
import precisionRound from './money/precision_round.mjs'

export const JS_LITE = 'jsl'
export const US_DOLLAR = '$'

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
  )({
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
    toString: () => `${amount} ${Money.Currencies[currency]}`,
    [Symbol.toPrimitive]: () => precisionRound(amount, 2),
    [Symbol.hasInstance]: i => i.constructor.name === 'Money'
  })
)

// Zero
Money.zero = (currency = JS_LITE) => Money(currency, 0)
Money.Currencies = {
  [JS_LITE]: 'JS Lite',
  [US_DOLLAR]: 'USD'
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
if (typeof Number.prototype.jsl !== 'function') {
  // Must be:
  // - writable: false
  // - enumerable: false
  // - configurable: false
  Object.defineProperty(Number.prototype, 'jsl', {
    value: function JsLiteCoin() {
      return Money(JS_LITE, this)
    },
    writable: false,
    configurable: false
  })
}

const validateAmount = composeM(isNumber, notNaN)

export default Money
