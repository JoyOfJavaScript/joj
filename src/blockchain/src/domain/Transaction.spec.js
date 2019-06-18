import Builder from './'
import Key from './value/Key'
import Money from './value/Money'
import Transaction from './Transaction'
import { assert } from 'chai'

describe('Transaction', () => {
  it('Should create a valid transaction', () => {
    const tx = new Transaction('sally', 'luke', Money('₿', 0.1), null)
    console.log('Transaction Hash: ', tx.id)
    assert.isNotEmpty(tx.id)
    assert.equal(tx[Symbol.for('version')], '1.0')
    // assert.throws(() => {
    //   tx.version = '2.0'
    // }, TypeError)
    console.log(console.log(tx))
  })

  it('Should create a valid transaction using Builder pattern', () => {
    const tx = new Builder.Transaction()
      .from('sally')
      .to('luke')
      .having(Money('₿', 0.1))
      .withDescription('Test')
      .build()

    console.log('Transaction Hash: ', tx.id)
    assert.isNotEmpty(tx.id)
    assert.equal(tx[Symbol.for('version')], '1.0')
    console.log(console.log(tx))
  })
})

describe('Signature', () => {
  it('Should Sign Data using a private key', () => {
    const privateKey = Key('coinbase-private.pem')
    const coinbase = Key('coinbase-public.pem')
    const luke = Key('luke-public.pem')

    const transaction = new Transaction(coinbase, luke, Money('USD', 30), null)
    const signature = transaction.sign(privateKey, 'coinbase')
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)
    transaction.signature = signature

    const result = transaction.verifySignature(coinbase)
    assert.isOk(result)
  })

  it('Should sign transaction with null recipient', () => {
    const privateKey = Key('coinbase-private.pem')
    const publicKey = Key('coinbase-public.pem')

    const transaction = new Transaction(null, publicKey, Money('USD', 30), null)
    assert.isNotEmpty(transaction.id)
    const signature = transaction.sign(privateKey, 'coinbase')
    transaction.signature = signature
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)
    const result = transaction.verifySignature(publicKey)
    assert.isOk(result)
  })
})
