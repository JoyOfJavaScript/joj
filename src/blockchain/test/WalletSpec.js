import { assert } from 'chai'
import Wallet from '../src/data/Wallet'
import path from 'path'
import fs from 'fs'

describe('Wallet', () => {
  it('Should create a valid wallet with public and private keys', () => {
    const base = path.join(__dirname, '../../..', 'config')
    const privateKey = path.join(base, 'private.pem')
    const publicKey = path.join(base, 'public.pem')
    const wa = Wallet(
      fs.readFileSync(privateKey, 'utf8'),
      fs.readFileSync(publicKey, 'utf8')
    )
    assert.isNotEmpty(wa.publicKey)
    assert.isNotEmpty(wa.privateKey)
    assert.notEqual(wa.publicKey, wa.privateKey)
  })
})
