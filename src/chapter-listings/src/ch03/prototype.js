import { assert, expect } from 'chai'

describe('Traditional JavaScript domain modeling', () => {
  it('Studies the behavior of prototype object', () => {
    function Transaction (from, to) {
      this.from = from
      this.to = to
    }

    function NamedTransaction (name, from, to) {
      Transaction.call(this, from, to)
      this.name = name
    }
    NamedTransaction.prototype = Object.create(Transaction.prototype)

    const ins1 = new NamedTransaction('Transfer', 'Luis', 'Luke')
    const ins2 = new NamedTransaction('Transfer2', 'Luke', 'Ana')
    assert.equal(ins1.from, 'Luis')
    assert.equal(ins2.from, 'Luke')

    Object.getPrototypeOf(ins1).printName = function () {
      console.log('My name is: ', this.name)
    }
    ins1.printName()

    ins1.__proto__.from = 'Ana'
    assert.equal(ins1.from, 'Luis')
    assert.equal(ins1.__proto__.from, 'Ana')
    assert.equal(ins2.__proto__.from, 'Ana') // also changed ins2's prototype
  })

  it('Studies the behavior of new', () => {
    function Transaction (from, to) {
      this.from = from
      this.to = to
    }

    const instance = new Transaction('luis', 'luke')
    assert.isNotNull(instance)
    assert.isOk(instance instanceof Transaction)
    assert.isOk(Object.getPrototypeOf(instance) === Transaction.prototype)
    assert.isOk(Transaction.prototype.isPrototypeOf(instance))
    assert.isOk(instance instanceof Object)

    assert.throws(() => {
      Transaction('luis', 'luke')
    }, TypeError)

    function NamedTransaction (name, from, to) {
      Transaction.call(this, from, to)
      this.name = name
    }
    NamedTransaction.prototype = Object.create(Transaction) // bug forgot to use .prototype

    assert.throws(() => {
      new NamedTransaction('name', ' from', 'to')
    }, TypeError)
  })

  it('Studies the behavior of util.inherits', () => {
    function Transaction (from, to) {
      this.from = from
      this.to = to
    }

    function NamedTransaction (name, from, to) {
      Transaction.call(this, from, to)
      this.name = name
    }

    require('util').inherits(NamedTransaction, Transaction)

    const instance = new NamedTransaction('Transfer', 'Luis', 'Luke')
    assert.equal(instance.name, 'Transfer')
    assert.equal(instance.from, 'Luis')

    assert.isOk(instance instanceof Transaction)
    assert.isOk(instance instanceof NamedTransaction)
    assert.isOk(Object.getPrototypeOf(instance) === NamedTransaction.prototype)
    assert.isOk(Transaction.prototype.isPrototypeOf(NamedTransaction.prototype))
  })

  it('Studies Object.create', () => {
    const transaction = {
      from: 'Luis',
      to: 'Luke'
    }

    const moneyTransaction = Object.create(transaction)

    moneyTransaction.addFunds = function (money) {
      this.funds = money
    }
    console.log('Object prototype: ', Object.prototype)
    assert.isOk(Object.getPrototypeOf(transaction) === Object.prototype)
    assert.isOk(Object.getPrototypeOf(moneyTransaction) === transaction)
    assert.deepEqual(Object.getPrototypeOf(transaction), {})
    assert.isOk(transaction instanceof Object)
    assert.equal(moneyTransaction.from, 'Luis')
    moneyTransaction.addFunds(10)
    assert.equal(moneyTransaction.funds, 10)

    const cryptoTransaction = Object.create(moneyTransaction)
    cryptoTransaction.calculateHash = function () {
      const data = [this.from, this.to, this.funds].join('')
      let hash = 0, i = 0
      const len = data.length
      while (i < len) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash
    }
    assert.equal(cryptoTransaction.funds, 10)
    assert.isOk(cryptoTransaction.calculateHash() > 0)
  })

  it('Should create a simple Person/Student model', () => {
    function Transaction (from, to) {
      if (!(this instanceof Transaction)) {
        return new Transaction(from, to) // be careful about this.name and using new
      }
      this.from = from
      this.to = to
    }

    const p = new Transaction('luis', 'luke')
    const p2 = Transaction('luis', 'luke') // oops forgot to use 'new'

    assert.isOk(p instanceof Transaction)
    assert.isOk(Object.getPrototypeOf(p) === Transaction.prototype)
    assert.isOk(p2 instanceof Transaction)
    assert.isOk(Object.getPrototypeOf(p2) === Transaction.prototype)
    assert.isOk(p instanceof Object)
    assert.isOk(p2 instanceof Object)

    function MoneyTransaction (from, to, funds = 0) {
      if (!(this instanceof MoneyTransaction)) {
        return new MoneyTransaction(from, to)
      }
      Transaction.call(this, from, to)
      this.funds = funds
    }

    // It's very important to use Person.prototype here; otherwise you will not be able to extend Person and reassign to
    // this.name which is a function non-writable property. Length would have the same issue

    // Instead of passing .prototype, you can make Person an object literal, and then it will work
    console.log(
      'Transaction.name descriptor: ',
      Object.getOwnPropertyDescriptor(Transaction, 'name')
    )
    MoneyTransaction.prototype = Object.create(Transaction.prototype) // need to 'extend' the prototype of Transaction
    MoneyTransaction.prototype.constructor = MoneyTransaction // "fixes" the delegated `constructor` reference *

    MoneyTransaction.prototype.addFunds = function (funds) {
      this.funds = funds
    }
    const mtx = new MoneyTransaction('luis', 'luke')
    const mtx2 = MoneyTransaction('luis', 'luke')
    mtx.addFunds(10)
    assert.isOk(mtx instanceof MoneyTransaction)
    assert.isOk(mtx2 instanceof MoneyTransaction)
    assert.isOk(mtx instanceof Transaction)
    assert.isOk(MoneyTransaction.prototype instanceof Transaction)
    assert.notOk(MoneyTransaction.prototype instanceof MoneyTransaction)
    assert.isOk(MoneyTransaction.prototype.isPrototypeOf(mtx))
    assert.isOk(MoneyTransaction.prototype.isPrototypeOf(mtx2))
    assert.isOk(Transaction.prototype.isPrototypeOf(mtx))
    assert.isOk(Transaction.prototype.isPrototypeOf(MoneyTransaction.prototype))
    assert.isOk(Object.getPrototypeOf(mtx) === MoneyTransaction.prototype)
    assert.isOk(Object.getPrototypeOf(mtx2) === MoneyTransaction.prototype)
    assert.isOk(
      Object.getPrototypeOf(MoneyTransaction.prototype) ===
        Transaction.prototype
    )
    assert.isOk(mtx.constructor.name === 'MoneyTransaction') // *
    assert.isOk(mtx2.constructor.name === 'MoneyTransaction') // *
    // __proto__ = Points to the object which was used as prototype when the object was instantiated.
    // use Object.getPrototypeOf() instead
  })

  it('Should create a simple Foo/Bar model', () => {
    function Foo (who) {
      this.me = who
    }

    Foo.prototype.identify = function () {
      return 'I am ' + this.me
    }

    function Bar (who) {
      Foo.call(this, 'Bar:' + who)
    }

    Bar.prototype = Object.create(Foo.prototype)
    Bar.prototype.constructor = Bar // "fixes" the delegated `constructor` reference

    Bar.prototype.speak = function () {
      console.log('Hello, ' + this.identify() + '.')
    }

    const b1 = new Bar('b1')
    const b2 = new Bar('b2')

    b1.speak() // alerts: "Hello, I am Bar:b1."
    b2.speak() // alerts: "Hello, I am Bar:b2."

    // some type introspection
    b1 instanceof Bar // true
    b2 instanceof Bar // true
    b1 instanceof Foo // true
    b2 instanceof Foo // true
    Bar.prototype instanceof Foo // true
    Bar.prototype.isPrototypeOf(b1) // true
    Bar.prototype.isPrototypeOf(b2) // true
    Foo.prototype.isPrototypeOf(b1) // true
    Foo.prototype.isPrototypeOf(b2) // true
    Foo.prototype.isPrototypeOf(Bar.prototype) // true
    Object.getPrototypeOf(b1) === Bar.prototype // true
    Object.getPrototypeOf(b2) === Bar.prototype // true
    Object.getPrototypeOf(Bar.prototype) === Foo.prototype // true
  })
})
