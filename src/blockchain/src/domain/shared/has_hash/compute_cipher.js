import crypto from 'crypto'
import { curry } from '../../../../../adt/dist/combinators'

const computeCipher = curry((options, data) =>
  crypto
    .createHash(options.algorithm)
    .update(data)
    .digest(options.encoding)
)

export default computeCipher
