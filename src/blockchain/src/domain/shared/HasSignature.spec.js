import '../../lang/object.js'
import HasSignature from './HasSignature.js'
import Key from '../value/Key.js'
import chai from 'chai'

const { assert } = chai

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
    const sign = signature.sign(coinbasePrivateKey)
    signature.signature = sign
    assert.isNotEmpty(sign)

    // Assert 4 successful attempts
    for (const i in [1, 2, 3, 4]) {
      assert.isOk(signature.verifySignature(signature.sender))
    }

    // Create another signature (it will have its own attempts counter)
    process.env.SECURE_ATTEMPTS = 1
    signature.signature = signature.sign(lukePrivateKey)

    for (const i in [1, 2, 3]) {
      assert.isNotOk(signature.verifySignature(signature.sender))
    }

    // Halt
    assert.throws(() => {
      signature.verifySignature(signature.sender)
    }, 'Security violation detected! Halting program!')
  })
})
