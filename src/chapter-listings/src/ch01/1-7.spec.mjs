import chai from 'chai'

const { assert } = chai

describe('1.7 - Up and coming features', () => {
  it('Bind operator', () => {
    function callFoo() {
      return this.bar;
    }
    const obj = {
      bar: 42,
    };

    const boundFoo = callFoo.bind(obj);
    assert.equal(boundFoo(), 42); // 42

    assert.equal(obj:: callFoo(), 42)
  })
})
