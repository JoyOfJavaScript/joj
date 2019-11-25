
import chai from 'chai'

const { assert } = chai

describe('7.4 - Practical applicaton of symbols', () => {
  it('7.4 Using symbols to emulate private properties', () => {

    const _count = Symbol('count')

    class Counter {
      constructor(count) {
        this[_count] = count;
      }
      inc(by = 1) {
        return this[_count] += by
      }
      dec(by = 1) {
        return this[_count] -= by
      }
    }
    const counter = new Counter(3)
    assert.equal(counter.inc(), 4)
    assert.equal(counter.dec(), 3)
    assert.equal(counter.dec(), 2)
    assert.equal(counter.dec(), 1)
    assert.equal(counter.dec(), 0)
    assert.equal(counter.dec(), -1)
  })
})
