/**
 * Construct a new Wallet. The private key is used to sign the data and the
 * public key can be used to verify its integrity
 *
 * @return {Wallet} A new wallet
 */
const Wallet = (publicKey, privateKey) => {
  return {
    publicKey, // Public key will act as our address
    privateKey, // Private key is used to sign our transactions
    constructor: Wallet,
    [Symbol.hasInstance]: i => i.constructor.name === 'Wallet'
  }
}

export default Wallet
