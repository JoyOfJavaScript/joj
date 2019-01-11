import { curry, not, prop } from 'fp/combinators'
import Money from '../value/Money'
import balanceOf from './balance_of'

const computeBalance = curry((address, ledger) =>
  Array.from(ledger)
    .filter(not(prop('isGenesis')))
    .map(prop('pendingTransactions'))
    .flatten()
    .map(balanceOf(address))
    .reduce(Money.sum, Money.zero())
    .round()
)
export default computeBalance
