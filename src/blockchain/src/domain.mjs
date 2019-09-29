import Block from './domain/Block.mjs'
import Transaction from './domain/Transaction.mjs'

export { default as Block } from './domain/Block.mjs'
export { default as Transaction } from './domain/Transaction.mjs'
export { default as Blockchain } from './domain/Blockchain.mjs'

export default {
  Transaction: class {
    #sender
    #recipient
    #funds
    #description = 'Generic'
    #signerPrivateKey = undefined

    from(user) {
      this.#sender = user
      return this
    }
    to(user) {
      this.#recipient = user
      return this
    }
    having(amount) {
      this.#funds = amount
      return this
    }
    withDescription(sentence) {
      this.#description = sentence
      return this
    }
    signWith(privateKey) {
      this.#signerPrivateKey = privateKey
      return this
    }
    build() {
      const tx = new Transaction(this.#sender, this.#recipient, this.#funds, this.#description)
      if (this.#signerPrivateKey) {
        tx.signature = tx.sign(this.#signerPrivateKey)
      }
      return tx
    }
  },
  Block: class {
    #index
    #previousHash
    #pendingTransactions = []
    #difficulty = 0

    at(index) {
      this.#index = index
      return this
    }
    linkedTo(previousHash) {
      this.#previousHash = previousHash
      return this
    }

    withPendingTransactions(...pendingTransactions) {
      this.#pendingTransactions = pendingTransactions.flat()
      return this
    }

    withPendingTransaction(pendingTransaction) {
      pendingTransaction || this.#pendingTransactions.push(pendingTransaction)
      return this
    }

    withDifficulty(difficulty) {
      this.#difficulty = difficulty
      return this
    }
    build() {
      return new Block(this.#index, this.#previousHash, this.#pendingTransactions, this.#difficulty)
    }
  }
}
