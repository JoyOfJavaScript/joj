import { assert } from 'chai'
import Wallet from '../src/data/Wallet'
import BlockchainLogic from '../src/behavior/BlockchainLogic'
import Blockchain from '../src/data/Blockchain'
import Money from '../src/data/Money'
import Transaction from '../src/data/Transaction'
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

    const first = Transaction(null, miner.address, Money('₿', 100))
    first.generateSignature(miner.privateKey, miner.passphrase)
    ledger.pendingTransactions = [first]

    // Mine some initial block, after mining the reward is BTC 100 for wa
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    const balance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      miner.address
    )

    // Balance is zero because the reward has not been mined in the blockchain
    console.log('Miner starts out with', balance)
    assert.isOk(balance.equals(Money('₿', 100)))

    // Mine the next block to retrieve reward
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    BlockchainLogic.transferFundsBetween(ledger, miner, luke, Money('₿', 20))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    let lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
    )
    console.log("Luke's balance is", lukeBalance)
    assert.isOk(lukeBalance.equals(Money('₿', 20)))

    const minerBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      miner.address
    )
    console.log("Miner's balance is", minerBalance)
    assert.isOk(minerBalance.equals(Money('₿', 79.6)))

    // Transfer funds between Luke and Ana
    BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 10))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    let anaBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      ana.address
    )

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
    )

    assert.isOk(
      anaBalance.equals(Money('₿', 10)),
      `Ana's balance should be ₿10.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 9.8)),
      `Luke's balance should be ₿10.00 and was ${lukeBalance}`
    )

    // Both wallets currently have about 10 BTC
    BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 5))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    anaBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, ana.address)

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
    )

    // Assert Ana has BTC 70 and Luke has BTC 30
    assert.isOk(
      anaBalance.equals(Money('₿', 15)),
      `Ana's balance should be ₿15.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 4.7)),
      `Luke's balance should be ₿4.7 and was ${lukeBalance}`
    )

    // Ana sends Luke some BTC 5, then Luke returns 3
    BlockchainLogic.transferFundsBetween(ledger, ana, luke, Money('₿', 5))
    BlockchainLogic.transferFundsBetween(ledger, luke, ana, Money('₿', 3))
    BlockchainLogic.minePendingTransactions(ledger, miner.address)

    anaBalance = BlockchainLogic.calculateBalanceOfAddress(ledger, ana.address)

    lukeBalance = BlockchainLogic.calculateBalanceOfAddress(
      ledger,
      luke.address
    )

    // Assert Ana has BTC 80 and Luke has BTC 20
    assert.isOk(
      anaBalance.equals(Money('₿', 12.9)),
      `Ana's balance should be ₿17.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.round().equals(Money('₿', 6.64)),
      `Luke's balance should be ₿6.64 and was ${lukeBalance}`
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
