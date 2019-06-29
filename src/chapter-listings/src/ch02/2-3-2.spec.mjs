import chai from 'chai'

const { assert } = chai

describe('2.3.2 - Limitations of JavaScript class system', () => {
  it('Studies Fragile base object', () => {
    const util = {
      dotNetEmailValidator(email) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.net)+$/.test(email)) {
          throw new Error(`Invalid argument error. Must provide valid .net email: ${email}`)
        }
        return email
      },
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

    class Transaction {
      fromEmail = ''
      toEmail = ''

      constructor(fromEmail, toEmail) {
        this.fromEmail = Transaction.validateEmail(fromEmail)
        this.toEmail = Transaction.validateEmail(toEmail)
      }

      static validateEmail(email) {
        return util.emailValidator(email)
      }

      displayTransaction() {
        return `Transaction from ${this.fromEmail} to ${this.toEmail}`
      }
    }

    class NamedTransaction extends Transaction {
      transactionName = 'Generic'

      constructor(transactionName, fromEmail, toEmail) {
        super(fromEmail, toEmail)
        this.transactionName = NamedTransaction.validateName(transactionName)
      }

      static validateName(name) {
        return util.nameValidator(name)
      }
    }

    class MoneyTransaction extends NamedTransaction {
      funds = 0.0
      #feePercent = 0.6
      transactionId = ''

      constructor(transactionName, fromEmail, toEmail, funds = 0.0) {
        super(transactionName, fromEmail, toEmail)
        this.transactionId = this.calculateHash()
        this.funds = funds
      }

      addFunds(amount) {
        this.funds += amount
      }

      subtractFunds(amount) {
        this.funds -= amount
      }

      get netTotal() {
        return MoneyTransaction.precisionRound(this.funds * this.#feePercent, 2)
      }

      static precisionRound(number, precision) {
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
      }

      calculateHash() {
        const data = [this.transactionName, this.fromEmail, this.toEmail, this.funds].join('')
        let hash = 0

        let i = 0
        const len = data.length
        while (i < len) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
        }
        return hash
      }
    }

    const tx = new MoneyTransaction('Transfer', 'luke@joj.com', 'luis@joj.com')
    tx.addFunds(10)
    assert.equal(tx.netTotal, 6)
    assert.equal(MoneyTransaction.validateEmail('luke@joj.com'), 'luke@joj.com')
    assert.equal(tx.calculateHash(), -559322448)

    // Should not be allowed to do this!
    // Can change static properties
    Transaction.validateEmail = function(email) {
      return util.dotNetEmailValidator(email)
    }

    assert.throws(() => {
      MoneyTransaction.validateEmail('luke@joj.com')
    }, 'Invalid argument error. Must provide valid .net email: luke@joj.com')

    assert.isOk(tx.displayTransaction())
    Transaction.prototype.displayTransaction = function() {
      console.log(`Transaction from ${this.fromEmail} to ${this.toEmail}`)
    }
    assert.isNotOk(tx.displayTransaction())
  })
})
