import KeyPair from '../behavior/traits/KeyPair'

/**
 * Construct a new Wallet. The private key is used to sign the data and the
 * public key can be used to verify its integrity
 *
 * @return {Wallet} A new wallet
 */
const Wallet = () => {
  const state = {
    publicKey: '',
    privateKey: '',
    constructor: Wallet,
    [Symbol.hasInstance]: i => i.constructor.name === 'Wallet'
  }
  const instance = Object.assign(state, KeyPair(state))
  instance.generateKeyPair()
  return instance
}

export default Wallet
