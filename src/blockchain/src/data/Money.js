const IDENTITY = 0

const Money = (currency = 'USD', amount = IDENTITY) => ({
  amount,
  currency,
  inspect: () => `${amount} ${currency}`,
  serialize: () => `{amount: ${amount}, currency: ${currency}`,
  add: newAmount => Money(currency, amount + newAmount),
  nothing: () => Money(currency, IDENTITY),
  round: (precision = 2) => Money(currency, precisionRound(amount, precision))
})

/**
 * Returns the value of a number rounded to the nearest integer precision.
 */
const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export default Money
