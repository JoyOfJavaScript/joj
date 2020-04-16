import Builder from '../domain.js'
import Key from './value/Key.js'
import Money from './value/Money.js'
import Transaction from './Transaction.js'
import chai from 'chai'

const { assert } = chai

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
    console.log(tx)
  })
})

describe('Signature', () => {
  it('Should Sign Data using a private key', () => {
    const privateKey = Key('coinbase-private.pem')
    const coinbase = Key('coinbase-public.pem')
    const luke = Key('luke-public.pem')

    const transaction = new Transaction(coinbase, luke, Money('USD', 30), null)
    transaction.signTransaction(privateKey)
    assert.isNotEmpty(transaction.signature)
    const result = transaction.verifySignature(coinbase)
    assert.isOk(result)
  })

  it('Should sign transaction with null recipient', () => {
    const privateKey = Key('coinbase-private.pem')
    const publicKey = Key('coinbase-public.pem')

    const transaction = new Transaction(null, publicKey, Money('USD', 30), null)
    assert.isNotEmpty(transaction.id)
    transaction.signTransaction(privateKey)
    assert.isNotEmpty(transaction.signature)
    const result = transaction.verifySignature(publicKey)
    assert.isOk(result)
  })
})
