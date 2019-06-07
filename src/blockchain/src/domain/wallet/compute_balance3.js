import { curry, not, prop } from '../../lib/fp/combinators'
import Money from '../value/Money'
import balanceOf from './balance_of'

const computeBalance = curry((address, blocks) =>
  blocks
    .filter(not(prop('isGenesis')))
    .map(prop('transactions'))
    .flat()
    .map(balanceOf(address))
    .reduce(Money.sum, Money.zero())
    .round()
)
export default computeBalance
