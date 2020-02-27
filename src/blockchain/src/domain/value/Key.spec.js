import Key from './Key.js'
import assert from 'assert'

describe('Key', () => {
  it('Should use primitive value', () => {
    const k = Key('luke-public.pem')
    assert.equal(+k, 174)
    assert.equal(Number(k) + Number(k), 348)
    assert.ok(`${k}`.includes('BEGIN PUBLIC KEY'))
  })
})
