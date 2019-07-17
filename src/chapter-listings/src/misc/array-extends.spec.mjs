import chai from 'chai'

const { assert } = chai

describe('Extending from Arrays', () => {
  it('Should extend from Array using classes', () => {
    class Blockchain extends Array {
      // Chapter 7
      //   static get [Symbol.species] () {
      //     return Array
      //   }
    }
    const b1 = 1,
      b2 = 2,
      b3 = 3,
      b4 = 4
    const ledger = new Blockchain(b1, b2, b3)
    ledger.push(b4)
    assert.isOk(ledger instanceof Blockchain)
    assert.isOk(ledger instanceof Array)
    assert.equal(ledger.length, 4)
    const other = ledger.map(x => x)
    assert.isOk(other instanceof Blockchain)
    assert.isOk(Array.isArray(ledger))
    assert.isOk(Array.isArray(other))
  })
  it('Should extend from Array using classes (set species)', () => {
    class Blockchain extends Array {
      static get [Symbol.species]() {
        return Array
      }
    }
    const b1 = 1,
      b2 = 2,
      b3 = 3,
      b4 = 4
    const ledger = new Blockchain(b1, b2, b3)
    ledger.push(b4)
    assert.isOk(ledger instanceof Blockchain)
    assert.isOk(ledger instanceof Array)
    assert.equal(ledger.length, 4)
    const other = ledger.map(x => x)
    assert.isNotOk(other instanceof Blockchain)
    assert.isOk(Array.isArray(other))
    assert.isOk(Array.isArray(ledger))
  })

  it('Should extend from Array using prototype', () => {
    function Blockchain(...blocks) {
      Object.setPrototypeOf(blocks, Blockchain.prototype)
      return blocks
    }
    Blockchain.prototype = Object.create(Array.prototype)
    Blockchain.prototype.constructor = Blockchain

    const b1 = 1,
      b2 = 2,
      b3 = 3,
      b4 = 4
    const ledger = new Blockchain(b1, b2, b3)
    ledger.push(b4)
    assert.isOk(ledger instanceof Blockchain)
    assert.isOk(ledger instanceof Array)
    assert.equal(ledger.length, 4)
    assert.equal(ledger[0], 1)
    const other = ledger.map(x => x)
    assert.isNotOk(other instanceof Blockchain)
  })

  it('Should use structure typing (array-like) to behave like an array', () => {
    function Blockchain(...blocks) {
      for (let i = 0; i < blocks.length; i++) {
        this[i] = blocks[i]
      }

      this.length = blocks.length
      this.push = b => {
        this[this.length] = b
        return ++this.length
      }
    }

    const b1 = 1,
      b2 = 2,
      b3 = 3,
      b4 = 4
    const ledger = new Blockchain(b1, b2, b3)
    ledger.push(b4)
    assert.isOk(ledger instanceof Blockchain)
    assert.isNotOk(ledger instanceof Array)
    assert.equal(ledger.length, 4)
    assert.equal(ledger[0], 1)
    assert.equal(ledger[ledger.length - 1], 4)
    ledger.push(b1)
    assert.equal(ledger[ledger.length - 1], 1)
  })
})
