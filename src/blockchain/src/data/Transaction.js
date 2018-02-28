import Transaction from '../behavior/traits/Transaction'

const Transaction = (fromAddress, toAddress, amount) => {
  const state = {
    fromAddress,
    toAddress,
    amount
  }
  return Object.assign(state, Transaction(state))
}
