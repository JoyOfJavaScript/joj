/* eslint fp/no-mutation:0,fp/no-throw:0 */
import { curry, identity } from '../../combinators.js'

/**
 * Test whether some value is of type ctor
 *
 * @param {Type}   ctor  Any JavaScript type (Object | Function | Array | Number | String)
 * @param {Object} val   Any value
 * @return {boolean} True or false whether the value's type constructor matches
 */
export const is = ctor => val =>
  (val != null && val.constructor === ctor) || val instanceof ctor

const fork = (join, func1, func2) => val => join(func1(val), func2(val))

const type = val =>
  val === null
    ? 'Null'
    : !val
      ? 'Undefined'
      : Object.prototype.toString.call(val).slice(8, -1)

const tap = fn => x => {
  fn(x)
  return x
}

// Use either?
const typeErr = curry((name, cond) => {
  if (!cond) {
    throw new TypeError(`Wrong type used: ${name}`)
  }
  return cond
})

// Checks if the provided object of type T
// typeOf :: T -> a -> a | Error
export const typeOf = T => tap(fork(typeErr, type, is(T)))

// Typed 2-tuple (Pair)
// Pair :: (A, B) -> (a, b) -> Object
export const Pair = (A, B) => (l, r) =>
  ((left, right) => ({
    left,
    right,
    constructor: Pair,
    [Symbol.iterator]: function* () {
      yield left
      yield right
    },
    // Bifunctor
    // bimap :: (a -> c) -> (b -> d) -> Pair(a, b) -> Pair(c, d)
    bimap: (C, D) => (f, g) => Pair(C, D)(f(left), g(right)),
    mergeMap: C => f => Pair(C, C)(f(left), f(right)),
    foldL: (f, _ = identity) => f(identity(left)),
    foldR: (_ = identity, g) => g(identity(right)),
    merge: f => f(left, right),
    equals: otherPair => left === otherPair.left && right === otherPair.right,
    inspect: () => `Pair [${left}, ${right}]`,
    toArray: () => [left, right],
    toJSON: () => ({
      type: 'Pair',
      left,
      right
    }),
    [Symbol.toPrimitive]: hint =>
      hint === 'string'
        ? `Pair [${left}, ${right}]`
        : [left, right]
  }))(
    // Check that objects passed into this tuple are the right type
    typeOf(A)(l),
    typeOf(B)(r)
  )

Pair['@@implements'] = [
  'mergeMap',
  'bimap',
  'chain',
  'merge',
  'foldL',
  'foldR',
  'equals'
]

Pair.split = (predA, predB, arr) =>
  Pair(Array, Array)(arr.filter(predA), arr.filter(predB))
Pair.TYPE = Pair(String, String)('', '')
Pair['@@type'] = 'Pair'

export default Pair
