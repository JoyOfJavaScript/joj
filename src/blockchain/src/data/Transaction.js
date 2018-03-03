/**
 * A transaction holds information (typically) identifying who is making the payment,
 * the amount being transacted and to whom the payment is sent.
 *
 * @param {string} fromAddress  Origin of transaction
 * @param {string} toAddress    Destination of transaction
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
