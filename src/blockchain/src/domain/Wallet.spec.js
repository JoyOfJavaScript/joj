import Wallet from './Wallet.js'
import chai from 'chai'
import fs from 'fs'
import path from 'path'

const { assert } = chai

describe('Wallet', () => {
  it('Should create a valid wallet with public and private keys', () => {
    const base = path.join(process.cwd(), '../blockchain', 'wallets')
    const privateKey = path.join(base, 'coinbase-private.pem')
    const publicKey = path.join(base, 'coinbase-public.pem')
    const wa = new Wallet(fs.readFileSync(privateKey, 'utf8'), fs.readFileSync(publicKey, 'utf8'))
    assert.isNotEmpty(wa.publicKey)
    assert.isNotEmpty(wa.privateKey)
    assert.notEqual(wa.publicKey, wa.privateKey)
  })
})
