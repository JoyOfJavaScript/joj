import '../src/lang/object'
import HasSignature from '../src/data/shared/HasSignature'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'

describe('Signature', () => {
  it('Should return on verify after 3 attempts', () => {
    const base = path.join(__dirname, '../..', 'blockchain-wallets')
    const coinbaseprivateKeyPath = path.join(base, 'coinbase-private.pem')
    const coinbasepublicKeyPath = path.join(base, 'coinbase-public.pem')
    const lukePublicKeyPath = path.join(base, 'luke-public.pem')
    const lukePrivateKeyPath = path.join(base, 'luke-private.pem')

    const privateKey = fs.readFileSync(coinbaseprivateKeyPath, 'utf8')

    const signature = Object.mixin(
      {
        sender: fs.readFileSync(coinbasepublicKeyPath, 'utf8'),
        recipient: fs.readFileSync(lukePublicKeyPath, 'utf8')
      },
      HasSignature(['sender', 'recipient'])
    )

    console.log(signature)
    const sign = signature.generateSignature(privateKey)
    signature.signature = sign
    assert.isNotEmpty(sign)

    // Assert 4 successful attempts
    for (const i in [1, 2, 3, 4]) {
      assert.isOk(signature.verifySignature())
    }

    // Create another signature (it will have its own attempts counter)
    process.env.SECURE_ATTEMPTS = 1
    const otherPrivateKey = fs.readFileSync(lukePrivateKeyPath, 'utf8')
    signature.signature = signature.generateSignature(otherPrivateKey)

    for (const i in [1, 2, 3]) {
      assert.isNotOk(signature.verifySignature())
    }

    // Halt
    assert.throws(() => {
      signature.verifySignature()
    }, 'Security violation detected! Halting program!')
  })
})
