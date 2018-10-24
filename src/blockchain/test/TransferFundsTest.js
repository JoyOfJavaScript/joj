import BitcoinService from '../src/service/BitcoinService'
import Blockchain from '../src/data/Blockchain'
import Funds from '../src/data/Funds'
import Key from '../src/data/Key'
import Money from '../src/data/Money'
import Transaction from '../src/data/Transaction'
import Wallet from '../src/data/Wallet'
import { assert } from 'chai'

describe('Transfer Funds Test suite', () => {
  it('Should transfer funds from one wallet to the next', async () => {
    // Luke's digital wallet
    const luke = Wallet(Key('luke-public.pem'), Key('luke-private.pem'))

    // Ana's digital wallet
    const ana = Wallet(Key('ana-public.pem'), Key('ana-private.pem'))

    // Some miner
    const miner = Wallet(Key('miner-public.pem'), Key('miner-private.pem'))

    const ledger = Blockchain()

    const first = Transaction(
      null,
      miner.address,
      Funds((100).btc()),
      'First transaction'
    )
    first.signature = first.generateSignature(miner.privateKey)
    first.hash = first.calculateHash()
    ledger.addPendingTransaction(first)

    // Mine some initial block, after mining the reward is BTC 100 for wa
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    const balance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )

    // Balance is zero because the reward has not been mined in the blockchain
    console.log('Miner starts out with', balance)
    assert.isOk(balance.equals((100).btc()))

    // Mine the next block to retrieve reward
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    BitcoinService.transferFunds(
      ledger,
      miner,
      luke,
      Money('₿', 20),
      'Transfer ₿20 to Luke'
    )
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    let lukeBalance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      luke.address
    )
    console.log("Luke's balance is", lukeBalance)
    assert.isOk(lukeBalance.equals((20).btc()))

    let minerBalance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )
    assert.isOk(
      minerBalance.equals((104.6).btc()),
      `Miner's balance is ${minerBalance}`
    )

    // Transfer funds between Luke and Ana
    BitcoinService.transferFunds(
      ledger,
      luke,
      ana,
      Money('₿', 10),
      'Transfer ₿20 from Luke to Ana'
    )
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    let anaBalance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      ana.address
    )

    lukeBalance = BitcoinService.calculateBalanceOfWallet(ledger, luke.address)

    assert.isOk(
      anaBalance.equals((10).btc()),
      `Ana's balance should be ₿10.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals((9.8).btc()),
      `Luke's balance should be ₿9.8 and was ${lukeBalance}`
    )

    // Both wallets currently have about 10 BTC
    BitcoinService.transferFunds(
      ledger,
      luke,
      ana,
      (5).btc(),
      'Transfer ₿5 from Luke to Ana'
    )
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    anaBalance = BitcoinService.calculateBalanceOfWallet(ledger, ana.address)

    lukeBalance = BitcoinService.calculateBalanceOfWallet(ledger, luke.address)

    // Assert Ana has BTC 70 and Luke has BTC 30
    assert.isOk(
      anaBalance.equals((15).btc()),
      `Ana's balance should be ₿15.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals((4.7).btc()),
      `Luke's balance should be ₿4.7 and was ${lukeBalance}`
    )

    // Ana sends Luke some BTC 5, then Luke returns 3
    BitcoinService.transferFunds(
      ledger,
      ana,
      luke,
      Money('₿', 5),
      'Transfer ₿5 from Ana back to Luke'
    )
    BitcoinService.transferFunds(
      ledger,
      luke,
      ana,
      Money('₿', 3),
      'Transfer ₿3 from Luke back to Ana'
    )
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    anaBalance = BitcoinService.calculateBalanceOfWallet(ledger, ana.address)

    lukeBalance = BitcoinService.calculateBalanceOfWallet(ledger, luke.address)

    // Assert Ana has BTC 80 and Luke has BTC 20
    assert.isOk(
      anaBalance.equals((12.9).btc()),
      `Ana's balance should be ₿17.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals((6.64).btc()),
      `Luke's balance should be ₿6.64 and was ${lukeBalance}`
    )

    // No funds left to transfer!
    assert.throws(
      () =>
        BitcoinService.transferFunds(
          ledger,
          luke,
          ana,
          (30).btc(),
          'Transfer ₿30 from Luke to Ana'
        ),
      RangeError
    )

    minerBalance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )
    assert.isOk(
      minerBalance.equals((142.1).btc()),
      `Miner's balance is ${minerBalance}`
    )

    // Print ledger
    // TODO:  Use ES7 String padding to format this output
    // console.log(ledger.map(x => x.inspect()))

    console.table(
      ledger.toArray().map(block => ({
        genesis: block.isGenesis() ? '\u2714' : false,
        previousHash: block.previousHash.valueOf(),
        hash: block.hash.valueOf(),
        count: block.countPendingTransactions()
      }))
    )

    assert.isOk(BitcoinService.isLedgerValid(ledger, true), 'Is ledger valid?')
  })
})
