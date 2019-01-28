import { createWallet as Wallet } from '.'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'

describe('Wallet', () => {
  it('Should create a valid wallet with public and private keys', () => {
    const base = path.join(__dirname, '../..', 'wallets')
    const privateKey = path.join(base, 'coinbase-private.pem')
    const publicKey = path.join(base, 'coinbase-public.pem')
    const wa = Wallet(
      fs.readFileSync(privateKey, 'utf8'),
      fs.readFileSync(publicKey, 'utf8')
    )
    assert.isNotEmpty(wa.publicKey)
    assert.isNotEmpty(wa.privateKey)
    assert.notEqual(wa.publicKey, wa.privateKey)
  })
})
