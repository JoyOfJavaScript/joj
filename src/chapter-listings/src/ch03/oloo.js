import { assert } from 'chai'

const util = {
  emailValidator (email) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new Error(
        `Invalid argument error. Must provide valid email: ${email}`
      )
    }
    return email
  },
  nameValidator (name) {
    if (!name || name.length === 0) {
      throw new Error(
        `Invalid argument error. Must provide valid name to the transaction`
      )
    }
    return name
  }
}

describe('OLOO domain modeling', () => {
  it('Extends array using OLOO pattern', () => {
    // TODO: finish
    const MyArray = {
      init (element) {
        MyArray.prototype = Object.create(Array.prototype)
        return [element]
      }
    }
    const blockchain = Object.create(MyArray).init(createGenesisBlock())

    console.log(blockchain)
    blockchain.push({ hash: '234' })
    console.log(blockchain)
    console.log(blockchain instanceof Array)

    function createGenesisBlock () {
      return { hash: '0000' }
    }
  })

  it('Should create a simple Transaction model', () => {
    const Transaction = {}
    Transaction.init = function (fromEmail, toEmail) {
      this.fromEmail = _validateEmail(fromEmail)
      this.toEmail = _validateEmail(toEmail)

      function _validateEmail (email) {
        return util.emailValidator(email)
      }

      return this
    }

    const NamedTransaction = Object.create(Transaction)

    NamedTransaction.init = function (transactionName, fromEmail, toEmail) {
      // this.Transaction(fromEmail, toEmail) // super(fromEmail, toEmail)
      Transaction.init.call(this, fromEmail, toEmail)
      this.transactionName = transactionName
      return this
    }

    const MoneyTransaction = Object.create(NamedTransaction)

    MoneyTransaction.init = function (
      transactionName,
      fromEmail,
      toEmail,
      funds = 0.0
    ) {
      NamedTransaction.init.call(this, transactionName, fromEmail, toEmail)
      // this.NamedTransaction(transactionName, fromEmail, toEmail) // super(transactionName, fromEmail, toEmail)
      this.funds = funds
      this.transactionId = this.calculateHash()
      this.totalAfterFee = function () {
        return _precisionRound(this.funds * _feePercent, 2) // needs access to private method
      }

      const _feePercent = 0.6
      function _precisionRound (number, precision) {
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
      }

      return this
    }

    MoneyTransaction.addFunds = function (amount) {
      this.funds += amount
    }

    MoneyTransaction.calculateHash = function () {
      const data = [this.fromEmail, this.toEmail, this.funds].join('')
      let hash = 0

      let i = 0
      const len = data.length
      while (i < len) {
        hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
      }
      return hash ** 2
    }

    const inst1 = Object.create(MoneyTransaction).init(
      'Transfer',
      'luke@joj.com',
      'luis@joj.com'
    )
    inst1.addFunds(10)
    assert.equal(inst1.totalAfterFee(), 6)

    const tx1 = Object.create(MoneyTransaction).init(
      'Transfer',
      'luis@joj.com',
      'luke@joj.com'
    )
    tx1.addFunds(10)
    assert.isOk(tx1.calculateHash() > 0)

    assert.isOk(MoneyTransaction.isPrototypeOf(inst1))
    assert.isOk(Transaction.isPrototypeOf(inst1))
    assert.isOk(NamedTransaction.isPrototypeOf(inst1))
    assert.isOk(Object.getPrototypeOf(inst1) === MoneyTransaction)
    assert.notOk(inst1.constructor.name === 'MoneyTransaction')
  })

  it('Should create a simple Person/Student model', () => {
    const Person = {
      Person: function (name) {
        this.name = name
        return this
      },
      holler: function () {
        console.log('MY NAME IS ' + this.name.toUpperCase() + '!!')
      }
    }

    const Student = Object.create(Person)

    Student.Student = function (name, major) {
      // must use function keyword for 'this' to work
      this.Person(name)
      this.major = major
      return this
    }
    Student.study = function () {
      console.log("I'm studying", this.major)
    }

    const me = Object.create(Student).Student('luis', 'compsci')

    me.holler()
    me.study()

    // `instanceof` lies so it's probably these checks are not allowed
    // assert.isOk(me instanceof Student) Can't do this since this is no longer a function
    // assert.isOk(me instanceof Person)  Can't do this since this is no longer a functionc
    // assert.isOk(Student.prototype instanceof Person) Can't do this since this is no longer a function
    // assert.notOk(Student.prototype instanceof Student) Can't do this since this is no longer a function

    // Can't use Person.prototype because this hasn't been set
    assert.isOk(Student.isPrototypeOf(me))
    assert.isOk(Person.isPrototypeOf(me))
    assert.isOk(Object.getPrototypeOf(me) === Student)
    // assert.isOk(Person.prototype.isPrototypeOf(Student.prototype))
    // assert.isOk(Object.getPrototypeOf(me) === Student.prototype)
    // assert.isOk(Object.getPrototypeOf(Student.prototype) === Person.prototype)
    assert.notOk(me.constructor.name === 'Student')
    assert.isOk(me.constructor.name === 'Object')
  })

  it('Should create a simple Foo/Bar model', () => {
    const Foo = {
      Foo: function (who) {
        this.me = who
        return this
      },
      identify: function () {
        return 'I am ' + this.me
      }
    }

    const Bar = Object.create(Foo)

    Bar.Bar = function (who) {
      // "constructors" (aka "initializers") are now in the `[[Prototype]]` chain,
      // so `this.Foo(..)` works easily w/o any problems of relative-polymorphism
      // or .call(this,..) awkwardness of the implicit "mixin" pattern
      this.Foo('Bar:' + who)
      return this
    }

    Bar.speak = function () {
      console.log('Hello, ' + this.identify() + '.')
    }

    const b1 = Object.create(Bar).Bar('b1')
    const b2 = Object.create(Bar).Bar('b2')

    b1.speak() // alerts: "Hello, I am Bar:b1."
    b2.speak() // alerts: "Hello, I am Bar:b2."

    // some type introspection
    Bar.isPrototypeOf(b1) // true
    Bar.isPrototypeOf(b2) // true
    Foo.isPrototypeOf(b1) // true
    Foo.isPrototypeOf(b2) // true
    Foo.isPrototypeOf(Bar) // true
    Object.getPrototypeOf(b1) === Bar // true
    Object.getPrototypeOf(b2) === Bar // true
    Object.getPrototypeOf(Bar) === Foo // true
  })
})
