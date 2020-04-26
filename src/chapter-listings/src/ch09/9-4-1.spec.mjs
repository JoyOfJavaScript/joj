import chai from 'chai'

const { assert } = chai

describe('9.4.1 - What is an observable', () => {
  it('Simple Observable example', () => {
    const obs$ = Observable.of('The', 'Joy', 'of', 'JavaScript')
    let count = 0;
    const subs = obs$.subscribe({
      next(word) {
        assert.isNotNull(word)
        count++
      },
    })

    subs.unsubscribe()
    assert.equal(count, 4)
  })
})