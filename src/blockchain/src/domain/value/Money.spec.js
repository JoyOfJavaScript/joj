import Money from './Money.js'
import assert from 'assert'

describe('Money Value Object', () => {
  it('Should use primitive value', () => {
    const five = Money('USD', 5)
    assert.equal(five * 2, 10)
    assert.equal(five + five, 2 * five)
    assert.ok(Money('USD', five + five).equals(Money('USD', 10)))
    assert.equal((5).jsl().amount, 5)
    assert.equal((5).jsl().currency, 'jsl')
    assert.equal(+(5).jsl(), 5)
  })
  it('Should be frozen', () => {
    const five = Money('USD', 5)
    assert.throws(() => (five.amount = 3), TypeError)
  })
  it('Should prevent extension', () => {
    const five = Money('USD', 5)
    assert.throws(() => (five.toString = function () { }), TypeError)
  })
  it('Should prevent extension (delete)', () => {
    const five = Money('USD', 5)
    assert.throws(() => {
      delete five.plus
    }, TypeError)
  })
})
