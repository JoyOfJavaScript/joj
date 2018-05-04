// Function combinators
const identity = a => a
const isFunction = a => a && typeof a === 'function'
const compose2 = (f, g) => (...args) => f(g(...args))
const compose = (...fns) => fns.reduce(compose2)
const pipe = (...fns) => fns.reduceRight(compose2)
const flatten = array => [].concat.apply([], array)
const curry = fn => (...args1) =>
  args1.length === fn.length
    ? fn(...args1)
    : (...args2) => {
        const args = [...args1, ...args2]
        return args.length >= fn.length ? fn(...args) : curry(fn)(...args)
      }

// ADT helpers
const map = curry((f, M) => M.map(f))
const flatMap = curry((f, M) => M.flatMap(f))
const fold = M => M.fold()

module.exports = {
  isFunction,
  curry,
  pipe,
  compose,
  flatten,
  identity,
  map,
  flatMap,
  fold,
}
