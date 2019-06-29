import chai from 'chai'

const { assert } = chai

describe('2.1.2 - Differential inheritance', () => {
  it('Adds calculateHash to transaction', () => {
    const transaction = {
      sender: 'luis@joj.com',
      recipient: 'luke@joj.com'
    }

    const moneyTransaction = Object.create(transaction)
    moneyTransaction.funds = 0.0
    moneyTransaction.addFunds = function(funds = 0) {
      this.funds += Number(funds)
    }

    moneyTransaction.addFunds(10)
    assert.isTrue(Object.getPrototypeOf(moneyTransaction) === transaction)
    assert.equal(moneyTransaction.sender, 'luis@joj.com')
    assert.equal(moneyTransaction.funds, 10)

    const hashTransaction = Object.create(transaction)

    hashTransaction.calculateHash = function() {
      const data = [this.sender, this.recipient].join('')
      let hash = 0

      let i = 0
      while (i < data.length) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash ** 2
    }

    assert.equal(hashTransaction.calculateHash(), 60195031661110560)
  })

  it('Differentiate using Object.setPrototypeOf', () => {
    const transaction = {
      sender: 'luis@joj.com',
      recipient: 'luke@joj.com'
    }

    const hashTransaction = Object.create(transaction)

    hashTransaction.calculateHash = function() {
      const data = [this.sender, this.recipient].join('')
      let hash = 0

      let i = 0
      while (i < data.length) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash ** 2
    }

    assert.equal(hashTransaction.calculateHash(), 60195031661110560)

    const moneyTransaction = Object.setPrototypeOf({}, hashTransaction)
    moneyTransaction.funds = 0.0
    moneyTransaction.addFunds = function(funds = 0) {
      this.funds += Number(funds)
    }
    moneyTransaction.addFunds(10)
    assert.equal(moneyTransaction.calculateHash(), 60195031661110560)
    assert.equal(moneyTransaction.funds, 10)
    assert.equal(moneyTransaction.sender, 'luis@joj.com')
    assert.equal(moneyTransaction.recipient, 'luke@joj.com')
  })
})
