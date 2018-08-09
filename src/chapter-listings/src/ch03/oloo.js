import { assert, expect } from 'chai'

describe('Traditional JavaScript domain modeling', () => {
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
