import Money from './Money'
import { compose, curry } from '../../../adt/dist/combinators'
import 'core-js/fn/array/flatten'

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
        return computeBalance(ledger, this.publicKey)
      }
    }
  }
  return { ...props.state, ...props.method }
}

export function computeBalance (ledger, address) {
  const prop = curry((name, a) => a[name] && a[name])
  const balanceOf = curry((addr, tx) =>
    Money.add(
      tx.recipient === addr ? tx.funds : Money.zero(),
      tx.sender === addr ? tx.funds.asNegative() : Money.zero()
    )
  )

  return ledger
    .toArray()
    .filter(prop('isGenesis'))
    .map(prop('pendingTransactions'))
    .flatten()
    .map(balanceOf(address))
    .map(a => {
      console.log(a)
      return a
    })
    .reduce(Money.add, Money.zero())
    .round()
}

export default Wallet
