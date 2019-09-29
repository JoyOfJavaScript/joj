import chai from 'chai'

const { assert } = chai

describe('2.2 - Constructor functions', () => {
  it('Transaction hierarchy using constructor functions', () => {
    function Transaction(sender, recipient) {
      this.sender = sender
      this.recipient = recipient
    }

    function HashTransaction(sender, recipient) {
      if (!new.target) {
        return new HashTransaction(sender, recipient)
      }
      Transaction.call(this, sender, recipient)

      this.calculateHash = function () {
        const data = [this.sender, this.recipient].join('')
        let hash = 0

        let i = 0
        while (i < data.length) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
        }
        return hash ** 2
      }
    }

    assert.isNotNull(HashTransaction.prototype)
    HashTransaction.prototype = Object.create(Transaction.prototype)
    HashTransaction.prototype.constructor = HashTransaction

    const tx = new HashTransaction('luis@joj.com', 'luke@joj.com')
    assert.isTrue(tx.__proto__ === HashTransaction.prototype)
    assert.equal(tx.calculateHash(), 60195031661110560)
  })

  it('Omit new.target check', () => {
    function Transaction(sender, recipient) {
      this.sender = sender
      this.recipient = recipient
    }

    function HashTransaction(sender, recipient) {
      Transaction.call(this, sender, recipient)
    }

    assert.isNotNull(HashTransaction.prototype)
    HashTransaction.prototype = Object.create(Transaction.prototype)
    HashTransaction.prototype.constructor = HashTransaction

    assert.throws(
      () => {
        HashTransaction('luis@joj.com', 'luke@joj.com') // ooops!
      },
      TypeError,
      "Cannot set property 'sender' of undefined"
    )
  })

  it('Fat-finger prototype references', () => {
    function Transaction(sender, recipient) {
      this.sender = sender
      this.recipient = recipient
    }

    function HashTransaction(name, sender, recipient) {
      Transaction.call(this, sender, recipient)
      this.name = name
    }

    assert.isNotNull(HashTransaction.prototype)
    HashTransaction.prototype = Object.create(Transaction)
    HashTransaction.prototype.constructor = HashTransaction

    assert.throws(
      () => {
        new HashTransaction('Coffee purchase', 'luis@joj.com', 'luke@joj.com') // ooops!
      },
      TypeError,
      "Cannot assign to read only property 'name' of object '[object Object]'"
    )
  })
})
