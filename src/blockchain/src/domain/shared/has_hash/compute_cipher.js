import crypto from 'crypto'
import { curry } from '@lib/fp/combinators'

const computeCipher = curry((options, data) =>
  crypto
    .createHash(options.algorithm)
    .update(data)
    .digest(options.encoding)
)

export default computeCipher
