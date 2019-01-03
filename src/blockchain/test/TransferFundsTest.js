import { MethodCounter, TraceLog } from '../src/common/proxies'
import BitcoinService from '../src/domain/service/BitcoinService'
import Blockchain from '../src/domain/Blockchain'
import Key from '../src/domain/value/Key'
import Money from '../src/domain/value/Money'
import Transaction from '../src/domain/Transaction'
import Wallet from '../src/domain/Wallet'
import { assert } from 'chai'
import { compose } from '../../adt/dist/combinators'
import path from 'path'

describe('Transfer Funds Test suite', () => {
  it('Should transfer funds from one wallet to the next', async () => {
    // Luke's digital wallet
    const luke = Wallet(Key('luke-public.pem'), Key('luke-private.pem'))

    // Ana's digital wallet
    const ana = Wallet(Key('ana-public.pem'), Key('ana-private.pem'))

    // Some miner
    const miner = Wallet(Key('miner-public.pem'), Key('miner-private.pem'))

    const first = Transaction(
      null,
      miner.address,
      (100).btc(),
      'First transaction'
    )
    first.signature = first.generateSignature(miner.privateKey)
    first.hash = first.calculateHash()
    const applyProxies = compose(
      TraceLog,
      MethodCounter('lookUp', 'validate')
    )
    const ledger = applyProxies(Blockchain())
    ledger.addPendingTransaction(first)

    const bitcoinService = new BitcoinService(ledger)

    // Mine some initial block, after mining the reward is BTC 100 for wa
    await bitcoinService.minePendingTransactions(miner.address)

    const balance = miner.balance(ledger)

    // Balance is zero because the reward has not been mined in the blockchain
    console.log('Miner starts out with', balance)
    assert.isOk(balance.equals((100).btc()))

    // Mine the next block to retrieve reward
    await bitcoinService.minePendingTransactions(miner.address)

    bitcoinService.transferFunds(
      miner,
      luke,
      Money('₿', 20),
      'Transfer ₿20 to Luke'
    )
    await bitcoinService.minePendingTransactions(miner.address)

    let lukeBalance = luke.balance(ledger)
    console.log("Luke's balance is", lukeBalance)
    assert.isOk(lukeBalance.equals((20).btc()))

    let minerBalance = miner.balance(ledger)
    assert.isOk(
      minerBalance.equals((104.6).btc()),
      `Miner's balance is ${minerBalance}`
    )

    // Transfer funds between Luke and Ana
    bitcoinService.transferFunds(
      luke,
      ana,
      Money('₿', 10),
      'Transfer ₿20 from Luke to Ana'
    )
    await bitcoinService.minePendingTransactions(miner.address)

    let anaBalance = bitcoinService.calculateBalanceOfWallet(ana.address)

    lukeBalance = bitcoinService.calculateBalanceOfWallet(luke.address)

    assert.isOk(
      anaBalance.equals((10).btc()),
      `Ana's balance should be ₿10.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals((9.8).btc()),
      `Luke's balance should be ₿9.8 and was ${lukeBalance}`
    )

    // Both wallets currently have about 10 BTC
    bitcoinService.transferFunds(
      luke,
      ana,
      (5).btc(),
      'Transfer ₿5 from Luke to Ana'
    )
    await bitcoinService.minePendingTransactions(miner.address)

    anaBalance = bitcoinService.calculateBalanceOfWallet(ana.address)

    lukeBalance = bitcoinService.calculateBalanceOfWallet(luke.address)

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
    bitcoinService.transferFunds(
      ana,
      luke,
      Money('₿', 5),
      'Transfer ₿5 from Ana back to Luke'
    )
    bitcoinService.transferFunds(
      luke,
      ana,
      Money('₿', 3),
      'Transfer ₿3 from Luke back to Ana'
    )
    await bitcoinService.minePendingTransactions(miner.address)

    anaBalance = bitcoinService.calculateBalanceOfWallet(ana.address)

    lukeBalance = bitcoinService.calculateBalanceOfWallet(luke.address)

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
        bitcoinService.transferFunds(
          luke,
          ana,
          (30).btc(),
          'Transfer ₿30 from Luke to Ana'
        ),
      RangeError
    )

    minerBalance = bitcoinService.calculateBalanceOfWallet(miner.address)
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
        count: block.pendingTransactions.length
      }))
    )

    const isLedgerValid = ledger.validate()
    console.log(isLedgerValid.merge())
    assert.isOk(isLedgerValid.isSuccess(), 'Is ledger valid?')
    assert.isAbove(ledger.lookUp.invocations, 0)
    assert.isAbove(ledger.validate.invocations, 0)
    console.log('Number of lookUps made: ', ledger.lookUp.invocations)
    console.log(
      'Number of ledger validations made: ',
      ledger.validate.invocations
    )

    const file = path.join(__dirname, '../..', 'test-run.txt')
    bitcoinService.writeLedger(file)
  })
})
