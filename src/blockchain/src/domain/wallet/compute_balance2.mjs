import { curry, not, prop } from '@lib/fp/combinators.mjs'
import Money from '../value/Money.mjs'
import balanceOf from './balance_of.mjs'

const computeBalance = curry((address, blocks) =>
  blocks
    .filter(not(prop('isGenesis')))
    .flatMap(prop('data'))
    .map(balanceOf(address))
    .reduce(Money.sum, Money.zero())
    .round()
)
export default computeBalance
