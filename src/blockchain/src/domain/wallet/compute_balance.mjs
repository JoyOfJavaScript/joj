import { compose, filter, flat, map, not, prop, reduce } from '~util/fp/combinators.mjs'
import Money from '../value/Money.mjs'
import balanceOf from './balance_of.mjs'

const computeBalance = address =>
  compose(
    Money.round,
    reduce(Money.sum, Money.zero()),
    map(balanceOf(address)),
    flat,
    map(prop('data')),
    filter(
      compose(
        not,
        prop('isGenesis')
      )
    )
  )

export default computeBalance
