import KeyPair from '../behavior/traits/KeyPair'

/**
 * Construct a new Wallet
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
