const Transaction = {
  init: (fromAddress, toAddress, amount) => {
    this.fromAddres = fromAddress
    this.toAddress = toAddress
    this.amount = amount
    return this
  }
}

Transaction.make = Object.create(Transaction).init
