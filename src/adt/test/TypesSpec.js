// @flow
declare var describe: any
declare var it: any

import { assert } from 'chai'
import type { _ADT } from '../src/_types'
import type { _Ok, _Error } from '../src/_types/_result'
import Result, { Ok, Error } from '../src/result'
import Maybe from '../src/maybe'

describe('Types', () => {
  it('Should check interface for ADT', () => {
    const ok: _ADT<string> = Result.fromNullable('hello')
    const r: string = ok.get()
    assert.equal(r, 'hello')

    const err: _ADT<string> = Result.fromNullable(null)
    const r2: number = err.getOrElse('other')
    assert.equal(r2, 'other')

    const mappable: _ADT<number> = Result.fromNullable(10)
    const r3: number = mappable.map(x => x ** 2).get()
    assert.equal(r3, 100)
  })

  it('Should check interface for Ok', () => {
    const ok: _Ok<string> = Result.fromNullable('hello')
    const r: string = ok.get()
    assert.isOk(ok.isOk())
    assert.equal(r, 'hello')
  })

  it('Should check interface for Error', () => {
    const err: _Error<string> = Error('Something happened!')
    const r: string = err.getOrElse('other')
    assert.isOk(err.isError())
    assert.equal(r, 'other')
    assert.throws(() => Error('FAILED!').get(), TypeError)
  })
})
