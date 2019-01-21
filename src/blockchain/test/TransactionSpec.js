import Key from '../src/domain/value/Key'
import Money from '../src/domain/value/Money'
import { createTransaction as Transaction } from '../src/domain'
import { assert } from 'chai'

describe('Transaction', () => {
  it('Should create a valid transaction', () => {
    const tx = Transaction('sally', 'luke', Money('₿', 0.1), null)
    tx.id = tx.calculateHash()
    console.log('Transaction Hash: ', tx.id)
    assert.isNotEmpty(tx.id)
    assert.equal(tx[Symbol.for('version')], '1.0')
    // assert.throws(() => {
    //   tx.version = '2.0'
    // }, TypeError)
    console.log(console.log(tx))
  })
})

describe('Signature', () => {
  it('Should Sign Data using a private key', () => {
    const privateKey = Key('coinbase-private.pem')
    const coinbase = Key('coinbase-public.pem')
    const luke = Key('luke-public.pem')

    const transaction = Transaction(coinbase, luke, Money('USD', 30), null)
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

    const transaction = Transaction(null, publicKey, Money('USD', 30), null)
    transaction.id = transaction.calculateHash()
    assert.isNotEmpty(transaction.id)
    const signature = transaction.generateSignature(privateKey, 'coinbase')
    transaction.signature = signature
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)
    const result = transaction.verifySignature()
    assert.isOk(result)
  })
})
