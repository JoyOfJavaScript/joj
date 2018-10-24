import {
  compose,
  curry,
  flatMap,
  getOrElseThrow,
  map
} from '../../../adt/dist/combinators'
import Validation from '../../../adt/dist/validation'

// Hashes always have a fixed length
const HASH_LENGTH = 64

const wrap = value => ({
  valueOf: () => value,
  length: value.length,
  toString: () => value,
  equals: o => value === o.toString(),
  [Symbol.toPrimitive]: () => value
})

const isValid = curry(
  (skip, h) =>
    (skip || (h && h.length === HASH_LENGTH)
      ? Validation.Success(h)
      : Validation.Failure([`Invalid hash value ${h}`]))
)

/**
 * Wrap a hash into a domain primitive hash value
 * @param {String}  value         String hash value
 * @param {Boolean} isGenesisHash Indicates whether the hash will be used for a Genesis Block so that proper validation may be skipped
 * @return {Object} wrapped hash
 */
const HashValue = (value, isGenesisHash = false) =>
  compose(
    getOrElseThrow(
      'Invalid hash found. Check that the hash value is not empty and meets the required length'
    ),
    map(wrap),
    flatMap(isValid(isGenesisHash)),
    Validation.fromNullable
  )(value)

export default HashValue
