// Function combinators
export const identity = a => a
export const isFunction = f =>
  f && typeof f === 'function' && Object.prototype.toString.call(f) === '[object Function]'
export const compose2 = (f, g) => (...args) => f(g(...args))
export const compose = (...fns) => fns.reduce(compose2)
export const pipe = (...fns) => fns.reduceRight(compose2)
export const curry = fn => (...args1) =>
  args1.length === fn.length
    ? fn(...args1)
    : (...args2) => {
      const args = [...args1, ...args2]
      return args.length >= fn.length ? fn(...args) : curry(fn)(...args)
    }

// ADT helpers
export const not = curry((f, a) => !f(a))
export const flat = M => M.flat()
export const prop = curry((name, a) => (a[name] && isFunction(a[name]) ? a[name].call(a) : a[name]))
export const props = curry((names, a) => names.map(n => prop(n, a)))
export const map = curry((f, M) => M.map(f))
export const reduce = curry((acc, start, M) => M.reduce(acc, start))
export const filter = curry((p, M) => M.filter(p))
export const composeM2 = (f, g) => (...args) => g(...args).flatMap(f)
export const composeM = (...Ms) => Ms.reduce(composeM2)
export const flatMap = curry((f, M) => M.flatMap(f))
export const fold = curry((f, M) => M.fold(f))
export const getOrElseThrow = curry((e, M) => M.getOrElseThrow(e))

export default {
  identity,
  isFunction,
  compose,
  compose2,
  composeM2,
  composeM,
  pipe,
  curry,
  map,
  filter,
  flatMap,
  fold,
  reduce,
  flat,
  prop,
  props,
  not,
  getOrElseThrow
}
