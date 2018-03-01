const Transaction = (fromAddress, toAddress, amount) => {
  const state = {
    fromAddress,
    toAddress,
    amount
  }
  return Object.assign(state)
}
export default Transaction
