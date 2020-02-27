import { curry, not, prop } from '~util/fp/combinators.js'
import Money from '../value/Money.js'
import balanceOf from './balance_of.js'

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
