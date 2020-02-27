import crypto from 'crypto'
import { curry } from '~util/fp/combinators.js'

const computeCipher = curry((options, data) =>
  crypto
    .createHash(options.algorithm)
    .update(data)
    .digest(options.encoding)
)

export default computeCipher
