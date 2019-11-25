import chai from 'chai'

const { assert } = chai

describe('7.1 - Using eval', () => {
  it('Runs simple script using eval', () => {
    /* eslint-disable no-eval */
    eval(
      `
       const add = (x, y) => x + y; 
       const r = add(3, 4); 
       console.log(r)
       assert.equal(r, 7)
      `
    )
    /* eslint-enable no-eval */
  })

  // it('Loads data from package.json', () => {
  //   assert.isNotNull(libConfig)
  // })
})
