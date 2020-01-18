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

  // it('Loads data from package.json', async () => {

  //   // Using dynamic import until Mocha adds proper supports for ESM
  //   // TODO: Move to a static import to match writing
  //   const { default: libConfigAsync } = await import(
  //     './mylib/package.json'   // No support yet for loading .json (was tested and passed with mjs-mocha)
  //   )
  //   assert.isNotNull(libConfigAsync)
  //   assert.equal(libConfigAsync.name, '@joj/chapter-listings-mylib-example')
  // })
})
