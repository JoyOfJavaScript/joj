import Funds from '../src/data/Funds'
import Money from '../src/data/Money'
import assert from 'assert'

describe('Funds object', () => {
  it('Should accept valid funds', () => {
    const f = Funds(Money(Money.Currencies.Bitcoin, 10))
    assert.equal(f.funds, 10)
  })

  it('Should reject invalid funds', () => {
    assert.throws(() => {
      Funds(Money(Money.Currencies.Bitcoin, -100))
    }, Error)
  })
})
