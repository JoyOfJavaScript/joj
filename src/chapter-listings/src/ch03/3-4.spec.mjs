import HasHash from '@joj/blockchain/domain/shared/HasHash.js'
import HasSignature from '@joj/blockchain/domain/shared/HasSignature.js'
import HasValidation from '@joj/blockchain/domain/shared/HasValidation.js'
import Key from '@joj/blockchain/domain/value/Key.js'
import chai from 'chai'

const { assert } = chai

const HasBread = {
  bread: 'Wheat',
  toasted: true
}

const HasToppings = {
  sauce: 'Ranch'
}

const HasTomatoes = {
  tomatoe: 'Cherry',
  cut: 'diced'
}

const HasMeat = {
  meat: 'Chicken',
  term: 'Grilled'
}

describe('3.4 - Assembling objects using mixins', () => {
  it('Simple mixin composition', () => {
    const Sandwich = (size = '6', unit = 'in') =>
      Object.assign(
        {
          size,
          unit
        },
        HasBread,
        HasToppings,
        HasTomatoes,
        HasMeat
      )

    const footLong = Sandwich(1, 'ft')
    assert.equal(footLong.tomatoe, 'Cherry')
  })

  it('Simple mixin composition using spread operator', () => {
    const Sandwich = (size = '6', unit = 'in') => ({
      size,
      unit,
      ...HasBread,
      ...HasToppings,
      ...HasTomatoes,
      ...HasMeat
    })

    const footLong = Sandwich(1, 'ft')
    assert.equal(footLong.tomatoe, 'Cherry')
  })

  it('Listing 3.3 Transaction object using mixin concatenation', () => {
    class Transaction {
      transactionId = ''
      timestamp = Date.now()
      #feePercent = 0.6

      constructor(sender, recipient, funds = 0.0, description = 'Generic') {
        this.sender = sender
        this.recipient = recipient
        this.funds = Number(funds)
        this.description = description
        this.transactionId = this.calculateHash()
      }

      displayTransaction() {
        return `Transaction ${this.description} from ${this.sender} to ${this.recipient} for ${
          this.funds
          }`
      }

      get netTotal() {
        return Transaction.precisionRound(this.funds * this.#feePercent, 2)
      }

      static precisionRound(number, precision) {
        // https://github.com/tc39/proposal-static-class-features
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
      }
    }

    Object.assign(
      Transaction.prototype,
      HasHash(['timestamp', 'sender', 'recipient', 'funds']),
      HasSignature(['sender', 'recipient', 'funds']),
      HasValidation()
    )

    const tx = new Transaction('luis@joj.com', 'luke@joj.com', 10)
    assert.equal(tx.sender, 'luis@joj.com')
    assert.equal(tx.recipient, 'luke@joj.com')
    assert.equal(tx.calculateHash().length, 64)
    assert.equal(
      tx.displayTransaction(),
      'Transaction Generic from luis@joj.com to luke@joj.com for 10'
    )
  })

  it('Listing 3.4 HasHash mixin', () => {
    const hashable = Object.assign({ foo: 'foo', bar: 'bar' }, HasHash(['foo', 'bar']))
    assert.equal(
      hashable.calculateHash(),
      'a9827ca249365f016ed0a9da9604634799792532c0559be0547348d44bbddbde'
    )
    assert.equal(hashable.calculateHash().length, 64)
  })

  it('Listing 3.5 HasSignature mixin', () => {
    const signable = Object.assign({ foo: 'foo', bar: 'bar' }, HasSignature(['foo', 'bar']))
    const testPublicKey = Key('test-public.pem')
    const testPrivateKey = Key('test-private.pem')
    const signature = signable.sign(testPrivateKey)
    assert.isTrue(signature.length > 0)
    assert.isTrue(signable.verifySignature(testPublicKey, signature))
  })
})
