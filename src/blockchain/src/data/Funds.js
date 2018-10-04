import { Failure, Success } from '../../../adt/dist/validation'
import { composeM } from '../../../adt/dist/combinators'

// TODO: look into using: https://github.com/tc39/proposal-bigint

/**
 * Used to represent funds transfered as part of a transaction
 *
 * @param {Money} money Amount of money to be transfered
 * @return {Funds} Returns a Funds object
 */
export const Funds = money => ({
  funds: validateAmount(money.amount).getOrElseThrow()
})

const notNaN = num =>
  (!isNaN(num) ? Success(num) : Failure([`Number (${num}) can't be NaN`]))
const isNumber = num =>
  (typeof num === 'number'
    ? Success(num)
    : Failure([`Input (${num}) is not a number`]))
const inRange = num =>
  (num >= 0
    ? Success(num)
    : Failure([`Number (${num}) must be greater or equal to zero`]))

const validateAmount = composeM(inRange, isNumber, notNaN)

export default Funds
