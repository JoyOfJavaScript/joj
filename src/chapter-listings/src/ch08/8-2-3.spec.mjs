import chai from 'chai'
const { assert } = chai

const unique = letters => Array.from(new Set(letters))
const join = arr => arr.join('')
const toUpper = str => str.toUpperCase()

describe('8.2.3 - Fluent chaining', () => {
  it('Shows simple case', async () => {
    const result = await Promise.resolve('aabbcc')
      .then(unique)  //#A
      .then(join)    //#A
      .then(toUpper) //#A
    assert.equal('ABC', result)
  })

  it('Badly formed chain', async () => {
    const p = Promise.resolve('aabbcc')
    const result1 = await p.then(unique)  // ['a','b','c'] #A
    const result2 = await p.then(join).catch(() => 'Error')    // Error         #A
    const result3 = await p.then(toUpper) // 'AABBCC'      #A
    assert.equal('aabbcc', await p)
    assert.deepEqual(['a', 'b', 'c'], result1)
    assert.equal('Error', result2)
    assert.equal('AABBCC', result3)
  })

  it('Shows error in chain', async () => {
    const result = await Promise.resolve('aabbcc')
      .then(unique)
      .then(() => throw new Error('Ooops!'))
      .then(join)     //#A
      .then(toUpper)  //#A 
      .catch(({ message }) => message) //#B

    assert.equal('Ooops!', result)
  })

  it('Shows nested chain', async () => {
    const result = await Promise.resolve('aabbcc')
      .then(unique)
      .then(data => {
        Promise.resolve(data)
          .then(join)
          .then(() => throw new Error('Nested Ooops!'))  // #A
      })
      .then(toUpper) //#B 
      .catch(({ message }) => message)

    assert.equal("Cannot read property 'toUpperCase' of undefined", result)
  })

  it('Shows fixed chain', async () => {
    const result = await Promise.resolve('aabbcc')
      .then(unique)
      .then(data => //#A
        Promise.resolve(data)
          .then(join)
          .then(() => throw new Error('Nested Ooops!'))
      )
      .then(toUpper)
      .catch(({ message }) => message) //#B

    assert.equal('Nested Ooops!', result)
  })

  it('Shows trivial fix', async () => {
    const result = await Promise.resolve('aabbcc')
      .then(unique)
      .then(data =>  //#A
        Promise.resolve(data)
          .then(join)
          .then(() => throw new Error('Inside Ooops!') )
          .catch(error => {
            console.error(`Catch inside: ${error.message}`)
            return 'ERROR'
          })
      )
      .then(toUpper)
      .catch(({ message }) => message)

    assert.equal('ERROR', result)
  })

  it('Shows finally', async () => {
    let ranFinallyBlock = false
    const result = await Promise.resolve('aabbcc')
      .then(unique)
      .then(join)
      .then(toUpper)
      .finally(() => {
        console.log('Done') //#B
        ranFinallyBlock = true
      })

    assert.equal('ABC', result)
    assert.isOk(ranFinallyBlock)
  })
})
