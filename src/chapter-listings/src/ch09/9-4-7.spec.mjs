import { filter, map, reduce, skip } from './rx.mjs'
import { ReactiveExtensions } from './rx.mjs'
import chai from 'chai'

const { assert } = chai

describe('9.4.7 - Pipeable operators', () => {
  it('Combining map, filter, reduce', done => {
    const square = num => num ** 2
    const isEven = num => num % 2 === 0
    const add = (x, y) => x + y

    let answer = 0
    Observable.of(1, 2, 3, 4)
      |> skip(1)
      |> filter(isEven)
      |> map(square)
      |> reduce(add, 0)
      |> ($ => $.subscribe({ next(value) { answer += value } }))
    assert.equal(answer, 20)
    done()
  })

  it('Piping with async example', done => {
    const toUpper = word => word.toUpperCase()

    async function* words() {
      yield 'Start'
      yield 'The'
      yield 'Joy'
      yield 'of'
      yield 'JavaScript'
    }

    Observable.fromGenerator(words()) |> skip(1) |> map(toUpper) |> ($ => $.subscribe({ next(word) { assert.isNotEmpty(word) }, complete: done }))
  })

  it('Piping using bind operator', done => {
    const { skip, map, filter, reduce } = ReactiveExtensions;

    const square = num => num ** 2
    const isEven = num => num % 2 === 0
    const add = (x, y) => x + y

    const subs = Observable.of(1, 2, 3, 4) 
        :: skip(1) 
        :: filter(isEven) 
        :: map(square) 
        :: reduce(add, 0)

    subs.subscribe({
      next(value) {
        console.log('In bind operator, value is', value)
        assert.equal(value, 20)
      },
      complete() {
        done()
      }
    })
  })
})