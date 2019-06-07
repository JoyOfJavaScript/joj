import { compose, filter, flat, map, not, prop, reduce } from '../../lib/fp/combinators'
import Money from '../value/Money'
import balanceOf from './balance_of'

const computeBalance = address =>
  compose(
    Money.round,
    reduce(Money.sum, Money.zero()),
    map(balanceOf(address)),
    flat,
    map(prop('transactions')),
    filter(
      compose(
        not,
        prop('isGenesis')
      )
    )
  )

export default computeBalance
