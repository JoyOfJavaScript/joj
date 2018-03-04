/**
 * A transaction holds information (typically) identifying who is making the payment
 * or relinquishing an asset, the monetary value being transacted and to whom is sent to.
 * Ownership of an asset (like  money) is transfered via transactions.
 *
 * @param {string} fromAddress  Origin of transaction
 * @param {string} toAddress    Destination of transaction
 * @param {Money}  money        Amount to transfer
 * @return {Transaction} Newly created transaction
 */
const Transaction = (fromAddress, toAddress, money) => {
  const state = {
    constructor: Transaction,
    [Symbol.hasInstance]: i => i.constructor.name === 'Transaction',
    fromAddress,
    toAddress,
    money
  }
  return Object.assign(state)
}
export default Transaction
