import '../../lang/object'
import HasSignature from './HasSignature'
import Key from '../value/Key'
import { assert } from 'chai'

describe('Signature', () => {
  it('Should return on verify after 3 attempts', () => {
    const coinbasePrivateKey = Key('coinbase-private.pem')
    const coinbasePublicKeyPath = Key('coinbase-public.pem')
    const lukePublicKey = Key('luke-public.pem')
    const lukePrivateKey = Key('luke-private.pem')

    const signature = Object.mixin(
      {
        sender: coinbasePublicKeyPath,
        recipient: lukePublicKey
      },
      HasSignature(['sender', 'recipient'])
    )

    console.log(signature)
    const sign = signature.generateSignature(coinbasePrivateKey)
    signature.signature = sign
    assert.isNotEmpty(sign)

    // Assert 4 successful attempts
    for (const i in [1, 2, 3, 4]) {
      assert.isOk(signature.verifySignature())
    }

    // Create another signature (it will have its own attempts counter)
    process.env.SECURE_ATTEMPTS = 1
    signature.signature = signature.generateSignature(lukePrivateKey)

    for (const i in [1, 2, 3]) {
      assert.isNotOk(signature.verifySignature())
    }

    // Halt
    assert.throws(() => {
      signature.verifySignature()
    }, 'Security violation detected! Halting program!')
  })
})
