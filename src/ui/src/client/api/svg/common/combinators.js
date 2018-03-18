const compose2 = (f, g) => (...args) => f(g(...args))
export const compose = (...fns) => fns.reduce(compose2)
export const pipe = (...fns) => fns.reduceRight(compose2)
