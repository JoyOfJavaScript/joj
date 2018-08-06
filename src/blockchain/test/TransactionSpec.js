import Money from '../src/data/Money'
import Transaction from '../src/data/Transaction'
import { assert } from 'chai'
import fs from 'fs'
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
    const base = path.join(__dirname, '../..', 'blockchain-wallets')
    const privateKey = fs.readFileSync(
      path.join(base, 'coinbase-private.pem'),
      'utf8'
    )
    const coinbase = fs.readFileSync(
      path.join(base, 'coinbase-public.pem'),
      'utf8'
    )
    const luke = fs.readFileSync(path.join(base, 'luke-public.pem'), 'utf8')

    const transaction = Transaction(coinbase, luke, Money('USD', 30))
    const signature = transaction.generateSignature(privateKey, 'coinbase')
    console.log('Signed data', signature)
    assert.isNotEmpty(signature)
    transaction.signature = signature

    const result = transaction.verifySignature()
    assert.isOk(result)
  })

  it('Should sign transaction with null recipient', () => {
    const base = path.join(__dirname, '../..', 'blockchain-wallets')
    const privateKey = fs.readFileSync(
      path.join(base, 'coinbase-private.pem'),
      'utf8'
    )
    const publicKey = fs.readFileSync(
      path.join(base, 'coinbase-public.pem'),
      'utf8'
    )

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
