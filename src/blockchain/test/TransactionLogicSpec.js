import { assert } from 'chai'
import TransactionLogic from '../src/behavior/TransactionLogic'
import path from 'path'

describe('TransactionLogic', () => {
  it('Should Sign Data using a wallet private key', () => {
    const base = path.join(__dirname, '../../..', 'config')
    const privateKey = path.join(base, 'private.pem')
    const signature = TransactionLogic.signInput(
      privateKey,
      'joyofjavascript',
      'Data to sign'
    )
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)

    const publicKey = path.join(base, 'public.pem')
    const result = TransactionLogic.verifySignature(
      publicKey,
      'Data to sign',
      signature
    )
    assert.isOk(result)
  })
})
