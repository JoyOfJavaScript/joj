import crypto from 'crypto'
import { curry } from '~util/fp/combinators.js'

const sign = curry((options, input, credentials) => {
  const s = crypto.createSign(options.algorithm)
  s.update(input)
  return s.sign(credentials, options.encoding)
})

export default sign
