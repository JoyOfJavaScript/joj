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
      Funds(Money('₿', 100)),
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
    assert.isOk(balance.equals(Money('₿', 100)))

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
    assert.isOk(lukeBalance.equals(Money('₿', 20)))

    let minerBalance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )
    assert.isOk(
      minerBalance.equals(Money('₿', 104.6)),
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
      anaBalance.equals(Money('₿', 10)),
      `Ana's balance should be ₿10.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 9.8)),
      `Luke's balance should be ₿10.00 and was ${lukeBalance}`
    )

    // Both wallets currently have about 10 BTC
    BitcoinService.transferFunds(
      ledger,
      luke,
      ana,
      Money('₿', 5),
      'Transfer ₿5 from Luke to Ana'
    )
    await BitcoinService.minePendingTransactions(ledger, miner.address)

    anaBalance = BitcoinService.calculateBalanceOfWallet(ledger, ana.address)

    lukeBalance = BitcoinService.calculateBalanceOfWallet(ledger, luke.address)

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
      anaBalance.equals(Money('₿', 12.9)),
      `Ana's balance should be ₿17.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals(Money('₿', 6.64)),
      `Luke's balance should be ₿6.64 and was ${lukeBalance}`
    )

    // No funds left to transfer!
    assert.throws(
      () =>
        BitcoinService.transferFunds(
          ledger,
          luke,
          ana,
          Money('₿', 30),
          'Transfer ₿30 from Luke to Ana'
        ),
      RangeError
    )

    minerBalance = BitcoinService.calculateBalanceOfWallet(
      ledger,
      miner.address
    )
    assert.isOk(
      minerBalance.equals(Money('₿', 142.1)),
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
