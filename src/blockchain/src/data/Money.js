const ZERO = 0

/**
 * Money value object
 *
 * @param {string} currency Type of currency (default: bitcoin)
 * @param {string} amount   Amount represented
 * @return {Money} Returns a money object
 */
const Money = (currency = '₿', amount = ZERO) => ({
  amount,
  currency,
  constructor: Money,
  equals: other => currency === other.currency && amount === other.amount,
  inspect: () => `${currency} ${amount}`,
  serialize: () => `{amount: ${amount}, currency: ${currency}`,
  round: (precision = 2) => Money(currency, precisionRound(amount, precision)),
  minus: m => Money(currency, amount - m.amount),
  plus: m => Money(currency, amount + m.amount),
  [Symbol.toPrimitive]: () => amount,
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

// Static helper functions
Money.nothing = currency => Money(currency, ZERO)
Money.add = (m1, m2) => m1.plus(m2)
Money.subtract = (m1, m2) => m1.minus(m2)

export default Money
