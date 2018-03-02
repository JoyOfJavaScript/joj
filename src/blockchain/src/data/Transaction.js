/**
 * A transaction holds information (typically) identifying who is making the payment,
 * the amount being transacted and to whom the payment is sent.
 *
 * @param {String} fromAddress  Origin of transaction
 * @param {String} toAddress    Destination of transaction
 * @param {Money}  money        Amount to transfer
 * @return {Transaction} Newly created transaction
 */
const Transaction = (fromAddress, toAddress, money) => {
  const state = {
    fromAddress,
    toAddress,
    money
  }
  return Object.assign(state)
}
export default Transaction
