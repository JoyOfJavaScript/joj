import './object.js'
import chai from 'chai'

const { assert } = chai

describe('Language extensions test', () => {
  it('Object.concat with null', () => {
    const p = Object.mixin(
      null,
      {
        get name() {
          return 'Luis'
        }
      },
      {
        log() {
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

    const p = Object.mixin(
      person,
      {
        print() {
          console.log('P name: ' + this.name)
        }
      },
      {
        log() {
          console.log('P log: ' + this.name)
        }
      }
    )

    const p2 = Object.mixin(person, {
      print() {
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
  it('Detects collissions', () => {
    const person = {
      name: 'Luis'
    }

    const objWithCollission = {
      print() {
        console.log('Printing in object with collission: ' + this.name)
      }
    }

    const p = Object.mixin(
      person,
      {
        print() {
          console.log('P name: ' + this.name)
        }
      },
      {
        log() {
          console.log('P log: ' + this.name)
        }
      },
      objWithCollission
    )

    assert.isOk(p.print)
    assert.isOk(p.log)
    assert.equal(p.name, 'Luis')

    p.print()

    // Prototype change should not affect derived types
    person.name = 'Luke'

    assert.equal(p.name, 'Luis')
  })
  it('Mixins with classes', () => {
    class Person {
      _first
      _last
      constructor(first, last) {
        this._first = first
        this._last = last
      }
      get first() {
        return this._first
      }
      get last() {
        return this._last
      }
    }

    const HasToJSON = {
      toJSON() {
        return {
          f: this.first,
          l: this.last
        }
      }
    }

    Object.assign(Person.prototype, HasToJSON)
    const p = new Person('Luis', 'Atencio')

    assert.isOk(p.first)
    assert.isOk(p.last)
    assert.isOk(p.toJSON)
    // assert.equal(p.name, 'Luis')
  })
})
