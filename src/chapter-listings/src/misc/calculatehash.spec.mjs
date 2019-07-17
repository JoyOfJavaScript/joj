import chai from 'chai'

const { assert } = chai

const compose2 = (f, g) => (...args) => f(g(...args))

const assemble = ({ fromEmail, toEmail, funds }) => [fromEmail, toEmail, funds].join('')

const computeCipher = data => {
  let hash = 0

  let i = 0
  while (i < data.length) {
    hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
  }
  return hash ** 2 // #A
}

describe('Calculate hash', () => {
  it('calculates a hash using composition', () => {
    const calculateHash = compose2(computeCipher, assemble)
    const Transaction = {
      fromEmail: 'luke@joj.com',
      toEmail: 'ana@joj.com',
      funds: 10
    }
    const result = calculateHash(Transaction)
    assert.equal(result, 2182608974236264700)
  })
  it('calculates a hash using composition and recursion', () => {
    const computeCipherRec = (data, i = 0, hash = 0) =>
      i >= data.length
        ? hash ** 2
        : computeCipherRec(data, i + 1, ((hash << 5) - hash + data.charCodeAt(i)) << 0)
    const calculateHash = compose2(computeCipherRec, assemble)
    const Transaction = {
      fromEmail: 'luke@joj.com',
      toEmail: 'ana@joj.com',
      funds: 10
    }
    const result = calculateHash(Transaction)
    assert.equal(result, 2182608974236264700)
  })
})
