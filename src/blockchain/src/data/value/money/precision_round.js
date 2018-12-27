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

export default precisionRound
