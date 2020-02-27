import HasHash from '@joj/blockchain/domain/shared/HasHash.js'
import HasValidation from '@joj/blockchain/domain/shared/HasValidation.js'
import chai from 'chai'

const { assert } = chai

describe('1.3.4 - Inheritance vs composition: why not both?', () => {
  it('Block class with composed mixins', () => {
    class Block {
      #version = '1.0'
      #blockchain
      hash
      constructor(index, previousHash, pendingTransactions = []) {
        this.index = index
        this.previousHash = previousHash
        this.pendingTransactions = pendingTransactions
        this.timestamp = Date.now()
      }

      set blockchain(b) {
        this.#blockchain = b
        return this
      }

      isGenesis() {
        return this.previousHash === '0'.repeat(64)
      }

      [Symbol.iterator]() {
        return this.pendingTransactions[Symbol.iterator]()
      }
    }

    Object.assign(
      // #A
      Block.prototype,
      HasHash(['index', 'timestamp', 'previousHash', 'pendingTransactions']),
      HasValidation()
    )
    const b = new Block(1, 'ABC123', [])
    assert.equal(b.index, 1)
    assert.equal(b.previousHash, 'ABC123')
    assert.isNotTrue(b.isGenesis())
    assert.isOk(b.calculateHash().length, 64)
  })
  it('Object.assign vs compose', () => {
    function compose(target, ...mixins) {
      let obj = target
      for (const mixin of mixins) {
        obj = { ...obj, ...mixin }
      }
      return obj
    }

    const poleWeapon = {
      material: 'wood'
    }

    const spear = {
      name: 'Javelin'
    }

    const weapon = compose(
      poleWeapon,
      spear
    )
    assert.equal(weapon.material, 'wood')
    assert.equal(weapon.name, 'Javelin')
  })
})
