import { assert, expect } from 'chai'

describe('Traditional JavaScript domain modeling', () => {
  it('Should create a simple Person/Student model', () => {
    function Person (name) {
      if (!(this instanceof Person)) {
        return new Person(name)
      }
      this.name = name
    }
    Person.prototype.holler = function () {
      console.log('MY NAME IS ' + this.name.toUpperCase() + '!!')
    }

    const p = new Person('luis')
    const p2 = Person('luke') // oops forgot to use 'new'
    p.holler()
    p2.holler()
    assert.isOk(p instanceof Person)
    assert.isOk(Object.getPrototypeOf(p) === Person.prototype)
    assert.isOk(p2 instanceof Person)
    assert.isOk(Object.getPrototypeOf(p2) === Person.prototype)

    function Student (name, major) {
      if (!(this instanceof Student)) {
        return new Student(name, major)
      }
      Person.call(this, name)
      this.major = major
    }
    // It's very important to use Person.prototype here; otherwise you will not be able to extend Person and reassign to
    // this.name which is a function non-writable property. Length would have the same issue

    // Instead of passing .prototype, you can make Person an object literal, and then it will work
    console.log(
      'Person.name descriptor: ',
      Object.getOwnPropertyDescriptor(Person, 'name')
    )
    Student.prototype = Object.create(Person.prototype) // need to 'extend' the prototype of Person

    Student.prototype.constructor = Student // "fixes" the delegated `constructor` reference *

    Student.prototype.study = function () {
      console.log("I'm studying", this.major)
    }
    const me = new Student('luis', 'compsci')
    const me2 = Student('luke', 'compsci')
    me.holler()
    me.study()
    assert.isOk(me instanceof Student)
    assert.isOk(me2 instanceof Student)
    assert.isOk(me instanceof Person)
    assert.isOk(Student.prototype instanceof Person)
    assert.notOk(Student.prototype instanceof Student)
    assert.isOk(Student.prototype.isPrototypeOf(me))
    assert.isOk(Student.prototype.isPrototypeOf(me2))
    assert.isOk(Person.prototype.isPrototypeOf(me))
    assert.isOk(Person.prototype.isPrototypeOf(Student.prototype))
    assert.isOk(Object.getPrototypeOf(me) === Student.prototype)
    assert.isOk(Object.getPrototypeOf(me2) === Student.prototype)
    assert.isOk(Object.getPrototypeOf(Student.prototype) === Person.prototype)
    assert.isOk(me.constructor.name === 'Student') // *
    assert.isOk(me2.constructor.name === 'Student') // *
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
