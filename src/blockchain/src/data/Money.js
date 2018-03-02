const ZERO = 0

/**
 * Money value object
 *
 * @param {String} currency Type of currency (default: bitcoin)
 * @param {String} amount   Amount represented
 * @return {Money} Returns a money object
 */
const Money = (currency = '₿', amount = ZERO) => ({
  amount,
  currency,
  equals: other => currency === other.currency && amount === other.amount,
  inspect: () => `${amount} ${currency}`,
  serialize: () => `{amount: ${amount}, currency: ${currency}`,
  round: (precision = 2) => Money(currency, precisionRound(amount, precision)),
  minus: qty => Money(currency, amount - qty),
  plus: qty => Money(currency, amount + qty)
})

/**
 * Returns the value of a number rounded to the nearest integer precision.
 *
 * @param {Number} number     Number to round
 * @param {Number} precision  Precision to round to
 * @return {Number} A round number
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
