import { Error, Ok } from '@joj/blockchain/util/fp/data/result/index.js'
import chai from 'chai'
import { curry } from '@joj/blockchain/util/fp/combinators.js'

const { assert } = chai

const user = {
  id: '123',
  firstname: 'Matthew',
  lastname: 'Atencio',
  address: {
    street: '14610',
    city: 'Miami Ave',
    state: 'FL',
    zip: 12345
  }
}

describe('5.7 - ADTs that help shape the future of JavaScript', () => {
  it('5.7.1	Optional chaining', () => {
    const street = user?.address?.street || 'N/A'
    const country = user?.address?.country || 'N/A'
    assert.equal(street, '14610')
    assert.equal(country, 'N/A')
  })
  it('Maybe/Result', () => {
    const safeNull = a => (a != null ? Ok(a) : Error())

    const prop = curry((name, obj) => obj[name]) //#A

    const getStreet = user =>
      safeNull(user)
        .map(prop('address'))
        .map(prop('street'))
    assert.equal(getStreet(user).merge(), '14610')
  })
  
  it('5.7.2	Try and throw expressions', () => {
    const checkData = data => (data !== null ? data : throw 'IllegalArgumentException')
    assert.throws(() => {
      checkData(null)
    }, 'IllegalArgumentException')
  })
})
