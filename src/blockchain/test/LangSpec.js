import '../src/lang/object'
import { assert } from 'chai'

describe('Language extensions test', () => {
  it('Object.concat with function constructor', () => {
    function Car (make) {
      this.make = make
      this[Symbol.for('base')] = true
    }
    const mixin = {
      moveFast: function () {
        return `${this.make} is moving fast`
      },
      moveSlow: function () {
        return `${this.make} is moving slowly`
      }
    }
    const newCar = Object.concat(new Car('nissan'), mixin)
    assert.equal(newCar.make, 'nissan')
    assert.equal(newCar.moveFast(), `nissan is moving fast`)
    assert.isOk(newCar instanceof Car)
    assert.equal(Object.getPrototypeOf(newCar).constructor.name, 'Car')
  })

  it('Object.concat with null', () => {
    const p = Object.concat(
      null,
      {
        get name () {
          return 'Luis'
        }
      },
      {
        log () {
          console.log('P log: ' + this.name)
        }
      }
    )

    assert.isOk(p.log)
    assert.equal(p.name, 'Luis')
  })

  it('Object.concat non-abstract', () => {
    const person = {
      name: 'Luis'
    }

    const p = Object.concat(
      person,
      {
        print () {
          console.log('P name: ' + this.name)
        }
      },
      {
        log () {
          console.log('P log: ' + this.name)
        }
      }
    )

    const p2 = Object.concat(person, {
      print () {
        console.log('P2 name: ' + this.name)
      }
    })
    console.log(p)
    assert.isOk(p.print)
    assert.isOk(p.log)
    assert.equal(p.name, 'Luis')
    assert.equal(p2.name, 'Luis')
    p.print()
    p2.print()

    // Prototype change should not affect derived types
    person.name = 'Luke'

    assert.equal(p.name, 'Luis')
    assert.equal(p2.name, 'Luis')
  })

  it('Object.concat abstract', () => {
    const person = {
      [Symbol.for('base')]: true,
      name: 'Luis'
    }

    const p = Object.concat(
      person,
      {
        print () {
          console.log('P name: ' + this.name)
        }
      },
      {
        log () {
          console.log('P log: ' + this.name)
        }
      }
    )

    const p2 = Object.concat(person, {
      print () {
        console.log('P2 name: ' + this.name)
      }
    })
    console.log(p)
    assert.isOk(p.print)
    assert.isOk(p.log)
    console.log('In person', Object.getPrototypeOf(p))
    assert.isOk(Object.getPrototypeOf(p) === person)
    assert.isOk(Object.getPrototypeOf(p2) === person)
    assert.isOk(p instanceof Object)
    assert.isOk(p2 instanceof Object)
    assert.equal(p.name, 'Luis')
    assert.equal(p2.name, 'Luis')

    assert.isNotOk(p === p2)

    // Prototype change DOES affect derived types (fragile base class)
    person.name = 'Luke'

    assert.equal(p.name, 'Luke')
    assert.equal(p2.name, 'Luke')
  })

  it('Object.deepFreeze', () => {
    assert.isOk(true)
  })
})
