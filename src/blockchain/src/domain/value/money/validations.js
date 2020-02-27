import { Failure, Success } from '~util/fp/data/validation2/validation.js'

/**
 * Check that currency matches
 * @param  {Money} m1 First instance
 * @param  {Money} m2 Second instance
 * @return {Validation} Validates whether currencies match
 */
export const currencyMatch = (m1, m2) =>
  m1.currency === m2.currency ? Success.of(true) : Failure.of(['Currency mismatch!'])

export const notNaN = m =>
  !isNaN(m.amount) ? Success.of(m) : Failure.of([`Number (${m.amount}) can't be NaN`])

export const isNumber = m =>
  typeof m.amount === 'number' ? Success.of(m) : Failure.of([`Input (${m.amount}) is not a number`])
