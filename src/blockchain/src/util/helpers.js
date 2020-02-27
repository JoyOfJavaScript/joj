import { curry, isFunction } from './fp/combinators.js'

export const toArray = a => [...a]

export const toJson = obj => {
    return isFunction(obj[Symbol.for('toJson')])
        ? obj[Symbol.for('toJson')]()
        : JSON.stringify(obj)
}

export const join = curry((serializer, delimeter, arr) => arr.map(serializer).join(delimeter))

export const buffer = str => Buffer.from(str, 'utf8')