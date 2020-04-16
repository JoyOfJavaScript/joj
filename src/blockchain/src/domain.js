import Block from './domain/Block.js'
import Money from './domain/value/Money.js'
import Transaction from './domain/Transaction.js'

export { default as Block } from './domain/Block.js'
export { default as Transaction } from './domain/Transaction.js'
export { default as Blockchain } from './domain/Blockchain.js'

export default {
  Transaction: class {
    #sender
    #recipient
    #funds
    #description = 'Generic'
    #signerPrivateKey = undefined

    from(user = inputError('from')) {
      this.#sender = user
      return this
    }
    to(user = inputError('to')) {
      this.#recipient = user
      return this
    }
    having(amount) {
      this.#funds = amount || Money('$', 0.0)
      return this
    }
    withDescription(sentence) {
      this.#description = sentence || 'N/A'
      return this
    }
    signWith(privateKey = inputError('privateKey')) {
      this.#signerPrivateKey = privateKey
      return this
    }
    build() {
      const tx = new Transaction(this.#sender, this.#recipient, this.#funds, this.#description)
      if (this.#signerPrivateKey) {
        tx.signTransaction(this.#signerPrivateKey)
      }
      return tx
    }
  },
  Block: {
    at(index = 0) {
      this.index = index
      return this
    },

    linkedTo(previousHash = inputError('previousHash')) {
      this.previousHash = previousHash
      return this
    },

    withPendingTransactions(...pendingTransactions) {
      this.pendingTransactions = pendingTransactions.flat()
      return this
    },

    withPendingTransaction(pendingTransaction = inputError('pendingTransaction')) {
      this.pendingTransactions.push(pendingTransaction)
      return this
    },

    withDifficulty(difficulty = 0) {
      this.difficulty = difficulty < 0 ? 0 : difficulty
      return this
    },

    build() {
      return new Block(this.index, this.previousHash, this.pendingTransactions, this.difficulty)
    }
  },
  Transaction2: {

    from(user = inputError('from')) {
      this.sender = user
      return this
    },

    to(user = inputError('to')) {
      this.recipient = user
      return this
    },

    having(amount) {
      this.funds = amount || Money('$', 0.0)
      return this
    },

    withDescription(sentence) {
      this.description = sentence || 'N/A'
      return this
    },

    signWith(privateKey = inputError('privateKey')) {
      this.signerPrivateKey = privateKey
      return this
    },

    build() {
      const tx = new Transaction(this.sender, this.recipient, this.funds, this.description)
      if (this.signerPrivateKey) {
        tx.signTransaction(this.signerPrivateKey)
      }
      return tx
    }
  }
}

const inputError = field => throw new TypeError(`Expected non-null input for: ${field}`)
