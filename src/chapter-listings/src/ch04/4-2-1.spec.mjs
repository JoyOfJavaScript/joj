import chai from 'chai'
import { compose } from '@joj/blockchain/util/fp/combinators.js'

const { assert } = chai

describe('4.2.1 - Decomposing complex code', () => {
  it('Before decomposing', () => {
    class Transaction {
      constructor(sender, recipient, funds) {
        this.sender = sender
        this.recipient = recipient
        this.funds = funds
      }
      calculateHash() {
        const data = [this.sender, this.recipient, this.funds].join('')
        let hash = 0,
          i = 0
        while (i < data.length) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
        }
        return hash ** 2
      }
    }
    const tx = new Transaction('luke', 'ana', 10)

    assert.equal(tx.calculateHash(), 522821201025337600)
  })
  it('After decomposing', () => {
    class Transaction {
      constructor(sender, recipient, funds) {
        this.sender = sender
        this.recipient = recipient
        this.funds = funds
      }
      calculateHash() {
        return compose(
          computeCipher,
          assemble
        )(this) //#A
      }
    }
    const tx = new Transaction('luke', 'ana', 10)

    const assemble = ({ sender, recipient, funds }) => [sender, recipient, funds].join('')

    function computeCipher(data) {
      let hash = 0,
        i = 0
      while (i < data.length) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash ** 2 //#A
    }
    assert.equal(tx.calculateHash(), 522821201025337600)
  })

  it('After decomposing, using a recursive version of computeCipher', () => {
    class Transaction {
      constructor(sender, recipient, funds) {
        this.sender = sender
        this.recipient = recipient
        this.funds = funds
      }
      calculateHash() {
        return compose(
          computeCipher,
          assemble
        )(this) //#A
      }
    }
    const tx = new Transaction('luke', 'ana', 10)

    function assemble({ sender, recipient, funds }) {
      return [sender, recipient, funds].join('')
    }

    const computeCipher = (data, i = 0, hash = 0) =>
      i >= data.length
        ? hash ** 2
        : computeCipher(data, i + 1, ((hash << 5) - hash + data.charCodeAt(i)) << 0)

    assert.equal(tx.calculateHash(), 522821201025337600)
  })
})
