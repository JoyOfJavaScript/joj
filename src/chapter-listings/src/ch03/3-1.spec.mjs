import chai from 'chai'

const { assert } = chai

describe('3.1 - Object/behavior delegation with OLOO', () => {
  it('Listing 3.1 HashTransaction using simple object linking', () => {
    const Transaction = {
      init(sender, recipient, funds = 0.0) {
        this.sender = sender
        this.recipient = recipient
        this.funds = Number(funds)
        return this
      },
      displayTransaction() {
        return `Transaction from ${this.sender} to ${this.recipient} for ${this.funds}`
      }
    }

    const HashTransaction = Object.create(Transaction).init('luis@joj.com', 'luke@joj.com', 10)

    HashTransaction.calculateHash = function() {
      const data = [this.sender, this.recipient, this.funds].join('')
      let hash = 0

      let i = 0
      while (i < data.length) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash ** 2
    }

    const tx = Object.create(HashTransaction)
    assert.equal(tx.sender, 'luis@joj.com')
    assert.equal(tx.recipient, 'luke@joj.com')
    assert.equal(tx.calculateHash(), 197994095955825630)
    assert.equal(tx.displayTransaction(), 'Transaction from luis@joj.com to luke@joj.com for 10')
  })
})
