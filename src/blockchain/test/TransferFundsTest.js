import { assert } from 'chai'
import Wallet from '../src/data/Wallet'
import BlockchainLogic from '../src/behavior/BlockchainLogic'
import Blockchain from '../src/data/Blockchain'
import Money from '../src/data/Money'
import path from 'path'
import fs from 'fs'

describe('Transfer Funds', () => {
  // eslint-disable-next-line max-statements
  it('Should transfer funds from one wallet to the next', () => {
    const base = path.join(__dirname, '../../..', 'config')
    // Luke's digital wallet
    const luke = Wallet(
      fs.readFileSync(path.join(base, 'luke-public.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'luke-private.pem'), 'utf8'),
      'luke'
    )

    // Ana's digital wallet
    const ana = Wallet(
      fs.readFileSync(path.join(base, 'ana-public.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'ana-private.pem'), 'utf8'),
      'anad'
    )

    // Some miner
    const miner = Wallet(
      fs.readFileSync(path.join(base, 'coinbase-public.pem'), 'utf8'),
      fs.readFileSync(path.join(base, 'coinbase-private.pem'), 'utf8'),
      'coinbase'
    )

    const ledger = Blockchain.init()

    // Mine some initial block, after mining the reward is BTC 100 for wa
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    let balance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      miner.address
    )

    // Balance is zero because the reward has not been mined in the blockchain
    assert.isOk(balance.equals(Money.zero()))

    // Mine the next block to retrieve reward
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    balance = BlockchainLogic.calculateBalanceOfAddress(ledger, miner.address)
    assert.isOk(balance.equals(Money('₿', 100)))

    BlockchainLogic.transferFundsBetween(ledger, miner, luke, Money('₿', 100))

    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    balance = BlockchainLogic.calculateBalanceOfAddress(ledger, luke.address)
    assert.isOk(balance.equals(Money('₿', 100)))

    // Current blockchain contains the reward transaction for Luke,
    // Transfer funds between Luke and Ana
    BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 50))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    let anaBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      ana.address
    )

    let lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
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
    BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 20))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    anaBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, ana.address)

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
    )

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
    BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 10))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    anaBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, ana.address)

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
    )

    // Assert Ana has BTC 80 and Luke has BTC 20
    assert.isOk(
      anaBalance.equals(Money('₿', 80)),
      "Ana's balance should be ₿80.00"
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 20)),
      "Luke's balance should be ₿20.00"
    )

    // No funds left to transfer!
    assert.throws(
      () =>
        BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 30)),
      RangeError
    )
    // Print ledger
    console.log(ledger.map(x => x.inspect()))

    assert.isOk(BlockchainLogic.isChainValid(ledger, true), 'Is ledger valid?')
  })
})
