/**
 * Construct a new Wallet. The private key is used to sign the data and the
 * public key can be used to verify its integrity
 *
 * @param {Key} publicKey  Public Key (PEM). Also used as wallet's address to send funds to
 * @param {Key} privateKey Private key
 * @return {Wallet} A new wallet
 */
const Wallet = (publicKey, privateKey) => {
  return {
    publicKey, // Public key will act as our address
    privateKey, // Private key is used to sign our transactions
    get address () {
      return publicKey
    }
  }
}

export default Wallet
