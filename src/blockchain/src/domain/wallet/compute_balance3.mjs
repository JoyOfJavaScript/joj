import { curry, not, prop } from '~util/fp/combinators.mjs'
import Money from '../value/Money.mjs'
import balanceOf from './balance_of.mjs'

const computeBalance = curry((address, blocks) =>
  blocks
    .filter(not(prop('isGenesis')))
    .map(prop('data'))
    .flat()
    .map(balanceOf(address))
    .reduce(Money.sum, Money.zero())
    .round()
)
export default computeBalance
