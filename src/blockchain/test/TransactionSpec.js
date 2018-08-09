import Key from '../src/data/Key'
import Money from '../src/data/Money'
import Transaction from '../src/data/Transaction'
import { assert } from 'chai'

describe('Transaction', () => {
  it('Should create a valid transaction', () => {
    const tx = Transaction('sally', 'luke', Money('₿', 0.1))
    console.log('Transaction Hash: ', tx.hash)
    assert.isNotEmpty(tx.hash)
    assert.equal(tx.version, '1.0')
    assert.throws(() => {
      tx.version = '2.0'
    }, TypeError)
  })
})

describe('Signature', () => {
  it('Should Sign Data using a private key', () => {
    const privateKey = Key('coinbase-private.pem')
    const coinbase = Key('coinbase-public.pem')
    const luke = Key('luke-public.pem')

    const transaction = Transaction(coinbase, luke, Money('USD', 30))
    const signature = transaction.generateSignature(privateKey, 'coinbase')
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)
    transaction.signature = signature

    const result = transaction.verifySignature()
    assert.isOk(result)
  })

  it('Should sign transaction with null recipient', () => {
    const privateKey = Key('coinbase-private.pem')
    const publicKey = Key('coinbase-public.pem')

    const transaction = Transaction(null, publicKey, Money('USD', 30))
    assert.isNotEmpty(transaction.hash)
    const signature = transaction.generateSignature(privateKey, 'coinbase')
    transaction.signature = signature
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)
    const result = transaction.verifySignature()
    assert.isOk(result)
  })
})
