import assert from 'assert'
import Money from '../src/data/Money'

describe('Money Value Object', () => {
  it('Should use primitive value', () => {
    const five = Money('USD', 5)
    assert.ok(five instanceof Money())
    assert.equal(five * 2, 10)
    assert.equal(five + five, 2 * five)
    assert.ok(Money('USD', five + five).equals(Money('USD', 10)))
  })
})
