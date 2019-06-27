import Money from '../value/Money.mjs'
import { curry } from '@lib/fp/combinators.mjs'

const balanceOf = curry((addr, tx) =>
  Money.sum(
    tx.recipient === addr ? tx.funds : Money.zero(),
    tx.sender === addr ? tx.funds.asNegative() : Money.zero()
  )
)

export default balanceOf
