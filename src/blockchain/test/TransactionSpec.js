import { assert } from 'chai'
import Transaction from '../src/data/Transaction'
import Money from '../src/data/Money'
import path from 'path'

describe('Transaction', () => {
  it('Should create a valid transaction', () => {
    const tx = Transaction('sally', 'luke', Money('₿', 0.1))
    console.log('Transaction Hash: ', tx.hash)
    assert.isNotEmpty(tx.hash)
  })
})

describe('Signature', () => {
  it('Should Sign Data using a private key', () => {
    const base = path.join(__dirname, '../../..', 'config')
    const privateKey = path.join(base, 'coinbase-private.pem')
    const coinbase = path.join(base, 'coinbase-public.pem')
    const luke = path.join(base, 'luke-public.pem')

    const transaction = Transaction(coinbase, luke, Money('USD', 30), null)
    const signature = transaction.generateSignature(privateKey, 'coinbase')
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)

    const result = transaction.verifySignature()
    assert.isOk(result)
  })
})
