import { assert } from 'chai'
import Wallet from '../src/data/Wallet'
import Transaction from '../src/data/Transaction'
import Money from '../src/data/Money'
import path from 'path'
import fs from 'fs'

describe('Transfer Funds', () => {
  it('Should transfer funds from one wallet to the next', () => {
    const base = path.join(__dirname, '../../..', 'config')
    // Luke's digital wallet
    const wa = Wallet(
      fs.readFileSync(path.join(base, 'luke-private.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'luke-public.pem'), 'utf8')
    )

    // Ana's digital wallet
    const wb = Wallet(
      fs.readFileSync(path.join(base, 'ana-private.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'ana-public.pem'), 'utf8')
    )

    // Coinbase
    const coinbase = Wallet(
      fs.readFileSync(path.join(base, 'coinbase-private.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'coinbase-public.pem'), 'utf8')
    )

    const genesisTransaction = Transaction(
      coinbase.publicKey,
      wa.publicKey,
      Money('₿', 100),
      []
    )
  })
})
