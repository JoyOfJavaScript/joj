import { assert } from 'chai'
import Wallet from '../src/data/Wallet'
import Transaction from '../src/data/Transaction'
import BlockchainLogic from '../src/behavior/BlockchainLogic'
import TransactionalBlockchain from '../src/data/TransactionalBlockchain'
import Money from '../src/data/Money'
import path from 'path'
import fs from 'fs'

describe('Transfer Funds', () => {
  // eslint-disable-next-line max-statements
  it('Should transfer funds from one wallet to the next', () => {
    const base = path.join(__dirname, '../../..', 'config')
    // Luke's digital wallet
    const wa = Wallet(
      fs.readFileSync(path.join(base, 'luke-public.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'luke-private.pem'), 'utf8'),
      'luke'
    )

    // Ana's digital wallet
    const wb = Wallet(
      fs.readFileSync(path.join(base, 'ana-public.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'ana-private.pem'), 'utf8'),
      'ana'
    )

    const bitcoin = TransactionalBlockchain()

    // Money was mined
    BlockchainLogic.minePendingTransactions(bitcoin, wa.address)

    const balance = BlockchainLogic.calculateBalanceOfAddress(
      bitcoin,
      wa.address
    )
    assert.isOk(balance.equals(Money.zero()))

    // Luke picks up reward
    BlockchainLogic.minePendingTransactions(bitcoin, wa.address)

    const newBalance = BlockchainLogic.calculateBalanceOfAddress(
      bitcoin,
      wa.address
    )
    console.log('New balance is', newBalance)
    assert.isOk(newBalance.equals(Money('₿', 100)))

    // Transfer funds between Luke and Ana
    BlockchainLogic.transferFundsBetween(bitcoin, wa, wb, Money('₿', 50))

    const anaBalance = BlockchainLogic.calculateBalanceOfAddress(
      bitcoin,
      wb.address
    )

    const lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      bitcoin,
      wa.address
    )

    assert.isOk(anaBalance.equals(Money('₿', 50)))
    assert.isOk(lukeBalance.equals(Money('₿', 50)))
  })
})
