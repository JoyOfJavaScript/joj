import { curry, not, prop } from '../../../../adt/dist/combinators'
import Money from '../value/Money'
import balanceOf from './balance_of'

const computeBalance = curry((address, ledger) =>
  Array.from(ledger)
    .filter(not(prop('isGenesis')))
    .flatMap(prop('pendingTransactions'))
    .map(balanceOf(address))
    .reduce(Money.sum, Money.zero())
    .round()
)
export default computeBalance
