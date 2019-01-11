import {
  compose,
  curry,
  filter,
  flatten,
  map,
  not,
  prop,
  reduce
} from 'fp/combinators'
import Money from '../value/Money'
import balanceOf from './balance_of'

const computeBalance = curry((address, ledger) =>
  compose(
    Money.round,
    reduce(Money.sum, Money.zero()),
    map(balanceOf(address)),
    flatten,
    map(prop('pendingTransactions')),
    filter(
      compose(
        not,
        prop('isGenesis')
      )
    ),
    Array.from
  )(ledger)
)
export default computeBalance
