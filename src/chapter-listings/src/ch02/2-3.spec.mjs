import chai from 'chai'

const { assert } = chai

const helper = {
  emailValidator(email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new Error(`Invalid argument error. Must provide valid email: ${email}`)
    }
    return email
  },
  nameValidator(name) {
    if (!name || name.length === 0) {
      throw new Error(`Invalid argument error. Must provide valid name to the transaction`)
    }
    return name
  }
}

describe('2.3.1 - Prototypes !== classes', () => {
  it('Listing 2.3 Transaction hierarchy using constructor functions', () => {
    class Transaction {
      sender = ''
      recipient = ''
      funds = 0.0
      #feePercent = 0.6

      constructor(sender, recipient, funds = 0.0) {
        this.sender = Transaction.validateEmail(sender)
        this.recipient = Transaction.validateEmail(recipient)
        this.funds = Number(funds)
      }

      static validateEmail(email) {
        return helper.emailValidator(email) // #B
      }

      displayTransaction() {
        return `Transaction from ${this.sender} to ${this.recipient} 
             for ${this.funds}`
      }

      get netTotal() {
        return Transaction._precisionRound(this.funds * this.#feePercent, 2)
      }

      // Currently awaiting on Babel-eslint bug to address private class methods
      // https://github.com/babel/eslint-plugin-babel/issues/166
      // Using _ instead of # for now
      static _precisionRound(number, precision) {
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
      }
    }

    class HashTransaction extends Transaction {
      transactionId
      constructor(sender, recipient, funds = 0.0) {
        super(sender, recipient, funds)
        this.transactionId = this.calculateHash()
      }
      calculateHash() {
        const data = [this.sender, this.recipient, this.funds].join('')
        let hash = 0

        let i = 0
        while (i < data.length) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
        }
        return hash ** 2
      }

      displayTransaction() {
        return `${this.transactionId}: ${super.displayTransaction()}`
      }
    }
    const tx = new HashTransaction('luis@joj.com', 'luke@joj.com', 10)
    assert.equal(tx.calculateHash(), 197994095955825630)
  })

  it('Transaction using IIFE', () => {
    const Transaction = (function() {
      const feePercent = 0.6

      function precisionRound(number, precision) {
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
      }

      return {
        construct: function(sender, recipient, funds = 0.0) {
          this.sender = sender
          this.recipient = recipient
          this.funds = Number(funds)
          return this
        },
        netTotal: function() {
          return precisionRound(this.funds * feePercent, 2)
        }
      }
    })()

    const coffee = Transaction.construct('luke@joj.com', 'ana@joj.com', 2.5)
    assert.equal(coffee.sender, 'luke@joj.com')
    assert.equal(coffee.netTotal(), 1.5)
  })
})
