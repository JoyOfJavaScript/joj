import Block from '@joj/blockchain/domain/Block.js'
import chai from 'chai'

const { assert } = chai

function createGenesisBlock(previousHash = '0'.repeat(64)) {
  return new Block(1, previousHash, [])
}

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

describe('3.2.2 - Implicit Delegation', () => {
  it('Using a constructor function', () => {
    function Blockchain(genesis = createGenesisBlock()) {
      Object.setPrototypeOf(Array, Blockchain.prototype)
      return [genesis]
    }
    Blockchain.prototype = Object.create(Array.prototype)
    Blockchain.prototype.constructor = Blockchain

    const blockchain = new Blockchain()
    assert.equal(blockchain.length, 1)
    assert.equal(blockchain[0].previousHash, '0'.repeat(64))
  })
  it('Classes', () => {
    class Blockchain extends Array {
      constructor(genesis = createGenesisBlock()) {
        super(1)
        this[0] = genesis
      }
    }

    const blockchain = new Blockchain()
    assert.equal(blockchain.length, 1)
    assert.equal(blockchain[0].previousHash, '0'.repeat(64))
  })
  it('Array-like + constructor function', () => {
    function Blockchain(genesis = createGenesisBlock()) {
      const blocks = [genesis]
      for (let i = 0; i < blocks.length; i++) {
        this[i] = blocks[i]
      }
      this.length = blocks.length
      this.push = b => {
        this[this.length] = b
        return ++this.length
      }
    }
    const blockchain = new Blockchain()
    assert.equal(blockchain.length, 1)
    assert.equal(blockchain[0].previousHash, '0'.repeat(64))

    const blockchain2 = Array.from(new Blockchain())
    assert.equal(blockchain2.length, 1)
    assert.equal(blockchain2[0].previousHash, '0'.repeat(64))
  })

  it('OLOO', () => {
    const MyArray = {
      init(element) { //#A
        this.length = 0
        this.push(element)
        return this
      },
      push(b) {
        this[this.length] = b
        return ++this.length
      }
    }
    const Blockchain = Object.create(MyArray).init(createGenesisBlock())
    const chain = Object.create(Blockchain)

    assert.equal(chain.length, 1)
    assert.equal(chain[0].previousHash, '0'.repeat(64))
  })

  it('Listing 3.2 - Modeling Transaction using behavior delegation (OLOO)', () => {
    const Transaction = {
      init(sender, recipient, funds = 0.0) {
        const _feePercent = 0.6

        this.sender = Transaction.validateEmail(sender)
        this.recipient = Transaction.validateEmail(recipient)
        this.funds = Number(funds)

        this.netTotal = function () {
          return _precisionRound(this.funds * _feePercent, 2)
        }

        function _precisionRound(number, precision) {
          const factor = Math.pow(10, precision)
          return Math.round(number * factor) / factor
        }
        return this
      },
      displayTransaction() {
        return `Transaction from ${this.sender} to ${this.recipient} for ${this.funds}`
      }
    }
    Transaction.validateEmail = function (email) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw new Error(`Invalid argument error. Must provide valid email: ${email}`)
      }
      return email;
    }

    const HashTransaction = Object.create(Transaction)

    HashTransaction.init = function HashTransaction(sender, recipient, funds) {
      Transaction.init.call(this, sender, recipient, funds)
      this.transactionId = this.calculateHash()
      return this
    }

    HashTransaction.calculateHash = function () {
      const data = [this.sender, this.recipient, this.funds].join('')
      let hash = 0,
        i = 0
      while (i < data.length) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash ** 2
    }

    const tx = Object.create(HashTransaction).init('luis@joj.com', 'luke@joj.com', 10)
    assert.equal(tx.sender, 'luis@joj.com')
    assert.equal(tx.recipient, 'luke@joj.com')
    assert.equal(tx.calculateHash(), 197994095955825630)
    assert.equal(tx.displayTransaction(), 'Transaction from luis@joj.com to luke@joj.com for 10')
  })
})
