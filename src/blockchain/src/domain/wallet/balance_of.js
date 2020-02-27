import Money from '../value/Money.js'
import { curry } from '~util/fp/combinators.js'

const balanceOf = curry((addr, tx) =>
  Money.sum(
    tx.recipient === addr ? tx.funds : Money.zero(),
    tx.sender === addr ? tx.funds.asNegative() : Money.zero()
  )
)

export default balanceOf
