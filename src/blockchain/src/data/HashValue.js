import { compose, flatMap, getOrElseThrow, map } from '@joj/adt/combinators'
import Validation from '@joj/adt/validation'

// Hashes always have a fixed length
const HASH_LENGTH = 64

const wrap = h => ({
  toString: () => h,
  [Symbol.toPrimitive]: () => h,
  length: h.length,
  equals: o => h === o.toString()
})

const isValid = h =>
  (h && h.length === HASH_LENGTH
    ? Validation.Success(h)
    : Validation.Failure([`Invalid hash value ${h}`]))

/**
 * Wrap a hash into a domain primitive hash value
 * @param {String} h String hash
 * @return {Object} wrapped hash
 */
const HashValue = compose(
  getOrElseThrow(
    'Invalid hash found. Check that the hash value is not empty and meets the required length'
  ),
  map(wrap),
  flatMap(isValid),
  Validation.fromNullable
)

export default HashValue
