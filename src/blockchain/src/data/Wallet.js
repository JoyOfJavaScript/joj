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
      calculateBalance () {
        //
      }
    }
  }
  return { ...props.state, ...props.method }
}

export default Wallet
