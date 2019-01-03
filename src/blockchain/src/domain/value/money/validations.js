import { Failure, Success } from '../../../../../adt/dist/validation'

/**
 * Check that currency matches
 * @param  {Money} m1 First instance
 * @param  {Money} m2 Second instance
 * @return {Validation} Validates whether currencies match
 */
export const currencyMatch = (m1, m2) =>
  m1.currency === m2.currency ? Success(true) : Failure(['Currency mismatch!'])

export const notNaN = m =>
  !isNaN(m.amount) ? Success(m) : Failure([`Number (${m.amount}) can't be NaN`])

export const isNumber = m =>
  typeof m.amount === 'number'
    ? Success(m)
    : Failure([`Input (${m.amount}) is not a number`])
