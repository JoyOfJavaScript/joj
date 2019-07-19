import chai from 'chai'

const { assert } = chai

const isFunction = a =>
  a && //#A
  typeof a === 'function' &&
  Object.prototype.toString.call(a) === '[object Function]'

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

describe('4.3.1 - Curried Function Application', () => {
  it('Working with prop and props', () => {
    const prop = name => obj =>
      obj[name] && isFunction(obj[name]) ? obj[name].call(obj) : obj[name]

    const transaction = {
      sender: 'luis@joj.com',
      recipient: 'luke@joj.com',
      funds: 10.0
    }
    const getFunds = prop('funds')
    assert.equal(getFunds(transaction), 10)

    const props = (...names) => obj => names.map(n => prop(n)(obj))
    const data = props('sender', 'recipient', 'funds')
    assert.deepEqual(data(transaction), ['luis@joj.com', 'luke@joj.com', 10.0])

    const tx1 = new Transaction('luis@joj.com', 'luke@joj.com', 10)
    const tx2 = new Transaction('luis@joj.com', 'luke@joj.com', 12.5)
    const tx3 = new Transaction('luis@joj.com', 'luke@joj.com', 20)

    assert.deepEqual([tx1, tx2, tx3].map(prop('funds')), [10.0, 12.5, 20.0])

    assert.deepEqual([tx1, tx2, tx3].map(prop('calculateHash')), [
      197994095955825630,

      3553616057779083300,

      197994068367979520
    ])
  })
  it('Curried versions of prop', () => {
    const curry = fn => (...args1) =>
      args1.length === fn.length
        ? fn(...args1)
        : (...args2) => {
            const args = [...args1, ...args2]
            return args.length >= fn.length ? fn(...args) : curry(fn)(...args)
          }

    const prop = curry((
      name,
      obj //#A
    ) => (obj[name] && isFunction(obj[name]) ? obj[name].call(obj) : obj[name]))

    const tx1 = new Transaction('luis@joj.com', 'luke@joj.com', 10)
    const tx2 = new Transaction('luis@joj.com', 'luke@joj.com', 12.5)

    const fundsOf = prop('funds')
    assert.equal(fundsOf(tx1), 10.0)
    assert.equal(fundsOf(tx2), 12.5)
  })
})
