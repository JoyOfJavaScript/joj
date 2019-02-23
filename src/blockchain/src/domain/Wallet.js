import computeBalance from './wallet/compute_balance'
/**
 * Construct a new Wallet. The private key is used to sign the data and the
 * public key can be used to verify its integrity
 */
export default class Wallet {
  constructor (publicKey, privateKey) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
  get address () {
    return this.publicKey
  }
  balance (ledger) {
    return computeBalance(this.publicKey)([...ledger])
  }
}
