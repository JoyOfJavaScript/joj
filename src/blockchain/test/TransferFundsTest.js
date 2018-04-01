import { assert } from 'chai'
import Wallet from '../src/data/Wallet'
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
      'anad'
    )

    const ledger = TransactionalBlockchain()

    // Money was mined, after mining the reward is BTC 100 for wa
    BlockchainLogic.minePendingTransactions(ledger, wa)

    let balance = BlockchainLogic.calculateBalanceOfAddress(ledger, wa.address)

    assert.isOk(balance.equals(Money.zero()))

    // Mine the next block to retrieve reward
    BlockchainLogic.minePendingTransactions(ledger, wa)

    balance = BlockchainLogic.calculateBalanceOfAddress(ledger, wa.address)

    assert.isOk(balance.equals(Money('₿', 100)))

    // Current blockchain contains the reward transaction for Luke,
    // Transfer funds between Luke and Ana
    BlockchainLogic.transferFundsBetween(ledger, wa, wb, Money('₿', 50))

    let anaBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      wb.address
    )

    let lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      wa.address
    )

    assert.isOk(
      anaBalance.equals(Money('₿', 50)),
      "Ana's balance should be ₿50.00"
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 50)),
      "Luke's balance should be ₿50.00"
    )

    // Both wallets currently have BTC 50

    // Current blockchain contains the reward transaction for Luke,
    // Transfer funds between Luke and Ana
    BlockchainLogic.transferFundsBetween(ledger, wa, wb, Money('₿', 20))

    anaBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, wb.address)

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, wa.address)

    // Assert Ana has BTC 70 and Luke has BTC 30
    assert.isOk(
      anaBalance.equals(Money('₿', 70)),
      "Ana's balance should be ₿70.00"
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 30)),
      "Luke's balance should be ₿30.00"
    )

    // Luke sends another BTC 10 to Ana
    BlockchainLogic.transferFundsBetween(ledger, wa, wb, Money('₿', 10))

    anaBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, wb.address)

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, wa.address)

    // Assert Ana has BTC 80 and Luke has BTC 20
    assert.isOk(
      anaBalance.equals(Money('₿', 80)),
      "Ana's balance should be ₿80.00"
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 20)),
      "Luke's balance should be ₿20.00"
    )

    // No funds!
    assert.throws(
      () =>
        BlockchainLogic.transferFundsBetween(ledger, wa, wb, Money('₿', 30)),
      RangeError
    )
    // Print ledger
    console.log(ledger.blocks().map(x => x.inspect()))

    assert.isOk(BlockchainLogic.isChainValid(ledger, true), 'Is ledger valid?')
  })
})
