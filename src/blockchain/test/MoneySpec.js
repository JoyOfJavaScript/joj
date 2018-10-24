import Money from '../src/data/Money'
import assert from 'assert'

describe('Money Value Object', () => {
  it('Should use primitive value', () => {
    const five = Money('USD', 5)
    assert.ok(five instanceof Money())
    assert.equal(five * 2, 10)
    assert.equal(five + five, 2 * five)
    assert.ok(Money('USD', five + five).equals(Money('USD', 10)))
    assert.equal((5).btc().amount, 5)
    assert.equal((5).btc().currency, Money.Currencies.Bitcoin)
  })
})
