import { assert } from 'chai'

describe('Studies new and instanceof', () => {
  it('Using new', () => {
    function Transaction (from, to) {
      this.from = from
      this.to = to
    }
    const tx = new Transaction('a', 'b')
    assert.equal(tx.from, 'a')

    // Forget to use new
    assert.throw(() => {
      Transaction('a', 'b') // TypeError: Cannot set property 'from' of undefined
    }, TypeError)

    // Using new with function returns a value
    function Transaction2 (from, to) {
      this.from = from
      this.to = to
      return {
        fromEmail: from,
        toEmail: to
      }
    }
    const tx2 = new Transaction2('a', 'b')
    console.log(tx2)
    assert.isUndefined(tx2.from) // expected undefined to equal 'a'
  })

  it('Using instanceof', () => {
    class User {
      constructor ({ userName, avatar }) {
        this.userName = userName
        this.avatar = avatar
      }
    }
    const currentUser = new User({
      userName: 'Foo',
      avatar: 'foo.png'
    })
    assert.throw(() => {
      User.prototype = {} //     TypeError: Cannot assign to read only property 'prototype' of function 'class User
    }, TypeError)

    assert.isOk(currentUser instanceof User)

    // Shape - superclass
    function Shape () {
      this.x = 0
      this.y = 0
    }

    // superclass method
    Shape.prototype.move = function (x, y) {
      this.x += x
      this.y += y
      console.info('Shape moved.')
    }

    // Rectangle - subclass
    function Rectangle () {
      Shape.call(this) // call super constructor.
    }

    // subclass extends superclass
    Rectangle.prototype = Object.create(Shape.prototype)
    Rectangle.prototype.constructor = Rectangle

    const rect = new Rectangle()

    assert.isOk(rect instanceof Rectangle)
    assert.isOk(rect instanceof Shape)
  })
})
