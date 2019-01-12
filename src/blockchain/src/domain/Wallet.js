import computeBalance from './wallet/compute_balance'
import { curry } from 'fp/combinators'

/**
 * Construct a new Wallet. The private key is used to sign the data and the
 * public key can be used to verify its integrity
 *
 * @param {Key} publicKey  Public Key (PEM). Also used as wallet's address to send funds to
 * @param {Key} privateKey Private key
 * @return {Wallet} A new wallet
 */
export default curry(
  (publicKey, privateKey) =>
    new class Wallet {
      constructor () {
        this.publicKey = publicKey
        this.privateKey = privateKey
      }
      get address () {
        return publicKey
      }
      balance (ledger) {
        return computeBalance(this.publicKey)(ledger)
      }
    }()
)
