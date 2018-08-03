import BlockchainService from '../src/service/BlockchainService'
import Key from '../src/data/Key'
import Money from '../src/data/Money'
import Transaction from '../src/data/Transaction'
import Wallet from '../src/data/Wallet'
import { assert } from 'chai'

describe('Transfer Funds', () => {
  it('Should transfer funds from one wallet to the next', async () => {
    // Luke's digital wallet
    const luke = Wallet(Key('luke-public.pem'), Key('luke-private.pem'))

    // Ana's digital wallet
    const ana = Wallet(Key('ana-public.pem'), Key('ana-private.pem'))

    // Some miner
    const miner = Wallet(Key('miner-public.pem'), Key('miner-private.pem'))

    const ledger = BlockchainService.newBlockchain()

    const first = Transaction(null, miner.address, Money('₿', 100))
    first.signature = first.generateSignature(miner.privateKey)
    ledger.pendingTransactions = [first]

    // Mine some initial block, after mining the reward is BTC 100 for wa
    await BlockchainService.minePendingTransactions(ledger, miner.address)

    const balance = BlockchainService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )

    // Balance is zero because the reward has not been mined in the blockchain
    console.log('Miner starts out with', balance)
    assert.isOk(balance.equals(Money('₿', 100)))

    // Mine the next block to retrieve reward
    await BlockchainService.minePendingTransactions(ledger, miner.address)

    BlockchainService.transferFunds(ledger, miner, luke, Money('₿', 20))
    await BlockchainService.minePendingTransactions(ledger, miner.address)

    let lukeBalance = BlockchainService.calculateBalanceOfWallet(
      ledger,
      luke.address
    )
    console.log("Luke's balance is", lukeBalance)
    assert.isOk(lukeBalance.equals(Money('₿', 20)))

    let minerBalance = BlockchainService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )
    assert.isOk(
      minerBalance.equals(Money('₿', 104.6)),
      `Miner's balance is ${minerBalance}`
    )

    // Transfer funds between Luke and Ana
    BlockchainService.transferFunds(ledger, luke, ana, Money('₿', 10))
    await BlockchainService.minePendingTransactions(ledger, miner.address)

    let anaBalance = BlockchainService.calculateBalanceOfWallet(
      ledger,
      ana.address
    )

    lukeBalance = BlockchainService.calculateBalanceOfWallet(
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
    BlockchainService.transferFunds(ledger, luke, ana, Money('₿', 5))
    await BlockchainService.minePendingTransactions(ledger, miner.address)

    anaBalance = BlockchainService.calculateBalanceOfWallet(ledger, ana.address)

    lukeBalance = BlockchainService.calculateBalanceOfWallet(
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
    BlockchainService.transferFunds(ledger, ana, luke, Money('₿', 5))
    BlockchainService.transferFunds(ledger, luke, ana, Money('₿', 3))
    await BlockchainService.minePendingTransactions(ledger, miner.address)

    anaBalance = BlockchainService.calculateBalanceOfWallet(ledger, ana.address)

    lukeBalance = BlockchainService.calculateBalanceOfWallet(
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
      () => BlockchainService.transferFunds(ledger, luke, ana, Money('₿', 30)),
      RangeError
    )

    minerBalance = BlockchainService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )
    assert.isOk(
      minerBalance.round().equals(Money('₿', 142.14)),
      `Miner's balance is ${minerBalance}`
    )

    // Print ledger
    // TODO:  Use ES7 String padding to format this output
    // console.log(ledger.map(x => x.inspect()))

    assert.isOk(
      BlockchainService.isChainValid(ledger, true),
      'Is ledger valid?'
    )
  })
})
