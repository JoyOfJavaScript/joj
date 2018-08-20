import { assert, expect } from 'chai'

// MD5 and SHA-1 are no longer acceptable where collision resistance is required such as digital signatures.
// https://github.com/tc39/proposal-class-fields
// https://github.com/tc39/proposal-private-methods
describe('Class-based JavaScript domain modeling', () => {
  it('Studies JavaScript classes', () => {
    const util = {
      emailValidator (email) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          throw new Error(
            `Invalid argument error. Must provide valid email: ${email}`
          )
        }
        return email
      },
      nameValidator (name) {
        if (!name || name.length === 0) {
          throw new Error(
            `Invalid argument error. Must provide valid name to the transaction`
          )
        }
        return name
      }
    }

    class Transaction {
      from = ''
      to = ''
      validateEmail = email => util.emailValidator(email)

      constructor (from, to) {
        this.from = this.validateEmail(from)
        this.to = this.validateEmail(to)
      }
    }

    class NamedTransaction extends Transaction {
      name = 'Generic'
      validateName = name => util.nameValidator(name)

      constructor (name, from, to) {
        super(from, to)
        this.name = this.validateName(name)
      }
    }

    class MoneyTransaction extends NamedTransaction {
      funds = 0.0
      feePercent = 0.6

      addFunds (funds) {
        this.funds = funds
      }

      get total () {
        return this.funds * this.feePercent
      }
    }

    const inst1 = new MoneyTransaction(
      'Transfer',
      'luke@joj.com',
      'luis@joj.com'
    )
    inst1.addFunds(10)
    assert.equal(inst1.total, 6)

    class SecureTransaction extends MoneyTransaction {
      calculateHash () {
        const data = [this.from, this.to, this.funds].join('')
        let hash = 0, i = 0
        const len = data.length
        while (i < len) {
          hash = ((hash << 5) + hash + data.charCodeAt(i++)) << 0
        }
        return hash
      }
    }

    const secureTx = new SecureTransaction(
      'Transfer',
      'luis@joj.com',
      'luke@joj.com'
    )
    assert.isOk(secureTx.calculateHash() > 0)

    assert.isOk(Object.getPrototypeOf(secureTx) === SecureTransaction.prototype)
    assert.isOk(secureTx instanceof SecureTransaction)
    assert.isOk(secureTx instanceof MoneyTransaction)
    assert.isOk(secureTx instanceof Transaction)
    assert.isOk(secureTx instanceof Object)
    assert.equal(secureTx.from, 'luis@joj.com')

    class CryptoSigner {
      algorithm = 'RSA-SHA256'
      encoding = 'hex'
      constructor (algorithm, encoding) {
        this.algorithm = algorithm
        this.encoding = encoding
      }

      sign () {}

      verify () {}
    }

    class SignedTransaction extends SecureTransaction {
      senderKey
      receiverKey
      signer = new CryptoSigner('RSA-SHA256', 'hex')
      constructor (name, senderKey, receiverKey) {
        super(name, 'anonymous@joj.com', 'anonymous@joj.com')
        this.senderKey = this.verifySignature(senderKey)
        this.receiverKey = this.verifySignature(receiverKey)
      } // continue researching gorilla banana problem

      verifySignature (k) {
        return k
      }

      calculateHash () {
        this.from = this.senderKey.toString()
        this.to = this.receiverKey.toString()
        return super.calculateHash()
      }
    }

    const signedTx = new SignedTransaction(
      'Signed Transfer',
      'luis@joj.com',
      'luke@joj.com'
    )
    signedTx.addFunds(10)
    assert.isOk(signedTx.calculateHash() > 0)
    assert.equal(signedTx.funds, 10)
  })
})
