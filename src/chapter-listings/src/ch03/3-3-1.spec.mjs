import chai from 'chai'

const { assert } = chai

describe('3.3 - Functional Mixins', () => {
  it('3.3.1 - Object.assign uncovered', () => {
    const a = {
      a: 'a' //#A
    }

    const b = {
      b: 'b' //#A
    }

    assert.deepEqual(Object.assign({}, a, b), { a: 'a', b: 'b' })

    const parent = {
      parent: 'parent'
    }
    const c = Object.create(parent)
    c.c = 'c'

    assert.deepEqual(Object.assign({}, c), { c: 'c' })

    const Transaction = {}

    Object.defineProperties(Transaction, {
      sender: {
        value: '',
        writable: true,
        enumerable: true,
        configurable: true
      },
      recipient: {
        value: '',
        writable: true,
        enumerable: true,
        configurable: true
      }
    })

    assert.equal(Transaction.sender, '')
    assert.equal(Transaction.recipient, '')

    Transaction.sender = 'luke@joj.com'
    assert.equal(Transaction.sender, 'luke@joj.com')

    const y = {
      a: 'a'
    }

    const z = {
      b: 'b'
    }

    assert.deepEqual(Object.assign({}, y, z), { a: 'a', b: 'b' })

    const w = {
      a: 'ca',
      c: 'c'
    }

    assert.deepEqual(Object.assign({}, y, z, w), { a: 'ca', b: 'b', c: 'c' })
  })
})
