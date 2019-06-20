import Money from '../value/Money'
import { curry } from '@lib/fp/combinators'

const balanceOf = curry((addr, tx) =>
  Money.sum(
    tx.recipient === addr ? tx.funds : Money.zero(),
    tx.sender === addr ? tx.funds.asNegative() : Money.zero()
  )
)

export default balanceOf
