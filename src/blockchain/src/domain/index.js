import Wallet from './Wallet'
import { curry } from 'fp/combinators'

/**
 * Creates a new Wallet instance
 *
 * @param {Key} publicKey  Public Key (PEM). Also used as wallet's address to send funds to
 * @param {Key} privateKey Private key
 * @return {Wallet} A new wallet
 */
export const assembleWallet = curry(
  (publicKey, privateKey) => new Wallet(publicKey, privateKey)
)

// Alternate solution: http://2ality.com/2013/03/subclassing-builtins-es6.html

// TODO
// store blockchain to file db

export default { assembleWallet }
