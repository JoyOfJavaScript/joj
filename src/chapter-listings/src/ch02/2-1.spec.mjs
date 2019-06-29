import chai from 'chai'

const { assert } = chai

describe('2.1 - Reviewing "prototypal inheritance"', () => {
  it('Simple proto', () => {
    const proto = {
      sender: 'luis@joj.com'
    }

    const child = Object.create(proto) // #A
    child.recipient = 'luke@joj.com'

    assert.equal(child.sender, 'luis@joj.com')
    assert.equal(child.recipient, 'luke@joj.com')
  })

  it('Transaction objects linked using a basic prototype setup', () => {
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
  })
})
