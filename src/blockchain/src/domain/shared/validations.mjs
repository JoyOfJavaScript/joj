import { Failure, Success } from '@lib/fp/data/validation2/validation.mjs'
import { curry } from '@lib/fp/combinators.mjs'

export const checkTampering = obj =>
  obj.hash === obj.calculateHash() ? Success.of(obj) : Failure.of('Invalid hash')

export const checkLength = curry((len, obj) =>
  len === obj.hash.length ? Success.of(obj) : Failure.of(`Hash length must equal ${len}`)
)

export const checkVersion = curry((version, obj) =>
  version === obj[Symbol.for('version')] ? Success.of(obj) : Failure.of('Version mismatch')
)

export const checkTimestamps = curry((previousObjTimestamp, obj) =>
  obj.timestamp >= previousObjTimestamp ? Success.of(obj) : Failure.of(`Timestamps out of order`)
)