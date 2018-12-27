import Money from './value/Money'
import {
  compose,
  curry,
  filter,
  flatMap,
  flatten,
  map,
  not,
  prop,
  reduce
} from '../../../adt/dist/combinators'
import 'core-js/fn/array/flatten'
import 'core-js/fn/array/flat-map'

/**
 * Construct a new Wallet. The private key is used to sign the data and the
 * public key can be used to verify its integrity
 *
 * @param {Key} publicKey  Public Key (PEM). Also used as wallet's address to send funds to
 * @param {Key} privateKey Private key
 * @return {Wallet} A new wallet
 */
const Wallet = (publicKey, privateKey) => {
  const props = {
    state: {
      publicKey,
      privateKey
    },
    method: {
      get address () {
        return publicKey
      },
      balance (ledger) {
        return computeBalance(this.publicKey)(ledger)
      }
    }
  }
  return { ...props.state, ...props.method }
}

const balanceOf = curry((addr, tx) =>
  Money.sum(
    tx.recipient === addr ? tx.funds : Money.zero(),
    tx.sender === addr ? tx.funds.asNegative() : Money.zero()
  )
)

const computeBalance = address =>
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
  )

export function computeBalance2 (address, ledger) {
  // return compose(
  //   Money.round,
  //   reduce(Money.sum, Money.zero()),
  //   map(balanceOf(address)),
  //   flatten,
  //   map(prop('pendingTransactions')),
  //   filter(compose(not, prop('isGenesis'))),
  //   Array.from
  // )(ledger)

  // return compose(
  //   Money.round,
  //   reduce(Money.sum, Money.zero()),
  //   map(balanceOf(address)),
  //   flatMap(prop('pendingTransactions')),
  //   filter(
  //     compose(
  //       not,
  //       prop('isGenesis')
  //     )
  //   ),
  //   Array.from
  // )(ledger)

  // return Array.from(ledger)
  //   .filter(not(prop('isGenesis')))
  //   .map(prop('pendingTransactions'))
  //   .flatten()
  //   .map(balanceOf(address))
  //   .reduce(Money.sum, Money.zero())
  //   .round()

  return Array.from(ledger)
    .filter(not(prop('isGenesis')))
    .flatMap(prop('pendingTransactions'))
    .map(balanceOf(address))
    .reduce(Money.sum, Money.zero())
    .round()
}

export default Wallet
