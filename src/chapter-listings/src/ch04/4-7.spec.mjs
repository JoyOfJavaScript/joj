import chai from 'chai'

const { assert } = chai

describe('4.7 - Looking into the future', () => {
  it('Function binding', () => {
    const { map, filter, reduce } = Array.prototype //#A
    const b1 = {
      isGenesis: () => true,
      isValid: () => true
    }

    const b2 = {
      isGenesis: () => false,
      isValid: () => true
    }

    const b3 = {
      isGenesis: () => false,
      isValid: () => true
    }

    const result = [b1, b2, b3]
      ::filter(b => !b.isGenesis())
      ::map(b => b.isValid())
      ::reduce((a, b) => a && b, true)

    assert.deepEqual(result, true)
  })
  it('Pipelining', () => {
    const split = str => (str || '').split(/\s+/)
    const count = arr => (!arr ? 0 : arr.length)

    const result = '1 2 3' |> split |> count
    assert.equal(result, 3)

    const result2 = '1 2 3' |> split |> count |> (x => x ** 2)
    assert.equal(result2, 9)
  })
})
