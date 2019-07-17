import chai from 'chai'

const { assert } = chai

function validParam(name) {
  throw new Error(`Expected non-null or valid parameter ${name}`)
}

describe('Parameter validation with default arguments', () => {
  it('Uses default argument syntax to provide parameter validation', () => {
    function add(x = validParam('x'), y = validParam('y')) {
      return x + y
    }
    assert.equal(add(3, 5), 8)
  })

  it('Validates the second argument', () => {
    function add(x = validParam('x'), y = validParam('y')) {
      return x + y
    }
    assert.throws(() => add(3), /Expected non-null or valid parameter y/)
  })

  it('Validates the first argument', () => {
    function add(x = validParam('x'), y = validParam('y')) {
      return x + y
    }
    assert.throws(() => add(undefined, 3), /Expected non-null or valid parameter x/)
  })
})
