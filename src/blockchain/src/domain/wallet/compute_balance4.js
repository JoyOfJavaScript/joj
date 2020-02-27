import { compose, curry, filter, flatMap, map, not, prop, reduce } from '~util/fp/combinators.js'
import Money from '../value/Money.js'
import balanceOf from './balance_of.js'

const computeBalance = curry((address, blocks) =>
  compose(
    Money.round,
    reduce(Money.sum, Money.zero()),
    map(balanceOf(address)),
    flatMap(prop('data')),
    filter(
      compose(
        not,
        prop('isGenesis')
      )
    )
  )(blocks)
)
export default computeBalance
