import { currencyMatch, isNumber, notNaN } from './money/validations'
import Validation from '../../../../adt/dist/validation'
import { composeM } from '../../../../adt/dist/combinators'
import precisionRound from './money/precision_round'

export const BITCOIN = '₿'
export const US_DOLLAR = '$'

/**
 * Money value object
 *
 * @param {string} currency Type of currency (default: bitcoin)
 * @param {string} amount   Amount represented
 * @return {Money} Returns a money object
 */
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

// Zero
Money.zero = (currency = BITCOIN) => Money(currency, 0)
Money.Currencies = {
  Bitcoin: BITCOIN
}
Money.round = m => m.round()

// Compare money objects
Money.compare = (m1, m2) =>
  Validation.of(x => m1.compareTo(m2))
    .ap(currencyMatch(m1, m2))
    .merge()

// Add two money objects
Money.sum = (m1, m2) =>
  Validation.of(x => m1.plus(m2))
    .ap(currencyMatch(m1, m2))
    .flatMap(validateAmount)
    .merge()

// Subtract two Money objects
Money.subtract = (m1, m2) =>
  Validation.of(x => m1.minus(m2))
    .ap(currencyMatch(m1, m2))
    .merge()

Money.multiply = (m1, m2) =>
  Validation.of(x => m1.times(m2))
    .ap(currencyMatch(m1, m2))
    .merge()

// Language extension for Number.prototype
if (typeof Number.prototype.btc !== 'function') {
  // Must be:
  // - writable: false
  // - enumerable: false
  // - configurable: false
  Object.defineProperty(Number.prototype, 'btc', {
    value: function toBitcoin () {
      return Money(BITCOIN, this)
    },
    writable: false,
    configurable: false
  })
}

const validateAmount = composeM(isNumber, notNaN)

export default Money
