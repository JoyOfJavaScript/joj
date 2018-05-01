import { assert } from 'chai'
import { Maybe, Validation, Combinators } from '../src'
import computeHash from './computeHash'

const { Success, Failure } = Validation
const { compose, curry } = Combinators

describe('Natural transformation: List => Maybe', () => {
  it('SafeHead', () => {
    const safeHead = ([h]) => Maybe.fromNullable(h)
    assert.equal(safeHead([1, 2, 3]).merge(), 1)
    assert.isOk(safeHead([]).isNothing())
  })
})

describe('Natural Transformation: Maybe => Promise', () => {
  it('Make AJAX call when appropriate', async () => {
    const safeHash = obj => Maybe.fromNullable(obj).ap(Maybe.of(computeHash(2)))

    const hash = safeHash({
      name: 'UXDevSummit',
      year: 2018,
    })
    assert.isOk(hash.isJust())

    // Natural transformation Maybe<a> -> Promise<a>
    const value = await hash.fold(x => x)
    assert.isOk(value.startsWith('00'))

    const value2 = await hash.map(async x => (await x) + 'test').merge()
    console.log('value2 hash', value2)
    assert.isOk(value2.endsWith('test'))

    const noHash = safeHash(null)
    assert.isOk(noHash.isNothing())
  })

  it('Maybe with Promise under function composition', async () => {
    const apply = f => M => M.ap(M.of(f))
    const asyncMap = f => M => M.map(async => async.then(f))

    const safeHash = compose(apply(computeHash(2)), Maybe.fromNullable)

    let hash = safeHash({
      name: 'UXDevSummit',
      year: 2018,
    })
    assert.isOk(hash.isJust())

    const processHash = compose(asyncMap(v => v + 'test'), safeHash)
    hash = await processHash({
      name: 'UXDevSummit',
      year: 2018,
    }).getOrElse('other')
    assert.isOk(hash.endsWith('test'))

    hash = await processHash(null).getOrElse('other')
    assert.equal(hash, 'other')
  })
})

describe('Combine Maybe with Validation', () => {
  it('Add null validation through Maybe', () => {
    const notEmpty = str =>
      str && str.length > 0 ? Success(str) : Failure(['String is empty'])

    const emptyVal = Validation.of('')
      .flatMap(notEmpty)
      .toMaybe()
      .merge()

    const emptyVal1 = Maybe.fromNullable('')
      .toValidation()
      .flatMap(notEmpty)
      .merge()

    assert.deepEqual(emptyVal, emptyVal1)

    const nullVal = Maybe.fromNullable(null)
      .toValidation()
      .flatMap(notEmpty)
      .merge()

    assert.deepEqual(nullVal, ['Expected non-null argument'])

    const input = null
    const nullVal2 = Validation.of(x => x => x)
      .ap(Maybe.fromNullable(input).toValidation())
      .ap(notEmpty(input))
      .merge()
    assert.deepEqual(nullVal2, [
      'Expected non-null argument',
      'String is empty',
    ])
  })
})

//describe('Combine Maybe with Either', () => {})
