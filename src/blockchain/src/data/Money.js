import Validation from '../../../adt/dist/validation'

export const BITCOIN = '₿'

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
  asNegative: () => Money(currency, -amount),
  [Symbol.toPrimitive]: () => precisionRound(amount, 2),
  [Symbol.hasInstance]: i => i.constructor.name === 'Money'
})

/**
 * Returns the value of a number rounded to the nearest integer precision.
 *
 * @param  {number} number     Number to round
 * @param  {number} precision  Precision to round to
 * @return {number} A round number
 */
const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

// Zero
Money.zero = currency => Money(currency, 0)
Money.Currencies = {
  Bitcoin: BITCOIN
}

// Compare money objects
Money.compare = (m1, m2) =>
  Validation.of(x => m1.compareTo(m2)).ap(currencyMatch(m1, m2)).merge()

// Add two money objects
Money.add = (m1, m2) =>
  Validation.of(x => m1.plus(m2)).ap(currencyMatch(m1, m2)).merge()

// Subtract two Money objects
Money.subtract = (m1, m2) =>
  Validation.of(x => m1.minus(m2)).ap(currencyMatch(m1, m2)).merge()

Money.multiply = (m1, m2) =>
  Validation.of(x => m1.times(m2)).ap(currencyMatch(m1, m2)).merge()

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

/**
 * Check that currency matches
 * @param  {Money} m1 First instance
 * @param  {Money} m2 Second instance
 * @return {Validation} Validates whether currencies match
 */
const currencyMatch = (m1, m2) =>
  (m1.currency === m2.currency
    ? Validation.Success(true)
    : Validation.Failure(['Currency mismatch!']))

export default Money
