import chai from 'chai'

const { assert } = chai

describe('4.3 - Lazy coding', () => {
  it('Use default value to assert preconditions', () => {
    const isFunction = a =>
      a && //#A
      typeof a === 'function' &&
      Object.prototype.toString.call(a) === '[object Function]'

    assert.isTrue(isFunction(() => {}))

    function validParam(name) {
      throw new Error(`Please supply value for argument ${name}!`)
    }

    function add(x = validParam('x'), y = validParam('y')) {
      return x + y
    }
    assert.equal(add(3, 7), 10)
    assert.throws(() => {
      add(3)
    }, 'Please supply value for argument y!')
  })
  it('Shows add manually curried', () => {
    const add = x => y => x + y
    const addThreeTo = add(3)
    assert.equal(addThreeTo(7), 10)
  })
})
