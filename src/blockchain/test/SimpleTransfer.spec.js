import BitcoinService from '../src/domain/service/BitcoinService.js'
import Blockchain from '../src/domain/Blockchain.js'
import Builder from '../src/domain.js'
import Key from '../src/domain/value/Key.js'
import Money from '../src/domain/value/Money.js'
import Wallet from '../src/domain/Wallet.js'
import chai from 'chai'

const { assert } = chai

describe('Transfer Funds Test suite', () => {
  it('Should transfer funds from one wallet to the next', async () => {

    const { Transaction2: TransactionBuilder } = Builder
    const { from, to, having, withDescription, signWith, build } = TransactionBuilder

    // Luke's digital wallet
    const luke = new Wallet(Key('luke-public.pem'), Key('luke-private.pem'))

    // Ana's digital wallet
    const ana = new Wallet(Key('ana-public.pem'), Key('ana-private.pem'))

    // Some miner's digital wallet
    const miner = new Wallet(Key('miner-public.pem'), Key('miner-private.pem'))

    const ledger = new Blockchain()

    ledger.addPendingTransaction(
      {}
          :: from(null)
          :: to(miner.address)
          :: having((100).btc())
          :: withDescription('First transaction')
          :: signWith(miner.privateKey)
          :: build()
    )

    const service = BitcoinService(ledger)

    // Mine some initial block, after mining the reward is BTC 100 for wa
    await service.minePendingTransactions(miner.address, 2)

    const balance = miner.balance(ledger)

    // Balance is zero because the reward has not been mined in the blockchain
    assert.isOk(balance.equals((100).btc()))

    // Mine the next block to retrieve reward
    await service.minePendingTransactions(miner.address, 2)

    service.transferFunds(miner, luke, Money('₿', 20), 'Transfer 20 JSL to Luke')
    await service.minePendingTransactions(miner.address, 2)

    let lukeBalance = luke.balance(ledger)
    console.log("Luke's balance is", lukeBalance)
    assert.isOk(lukeBalance.equals((20).btc()))

    const minerBalance = miner.balance(ledger)
    assert.isOk(minerBalance.equals((104.6).btc()), `Miner's balance is ${minerBalance}`)

    // Transfer funds between Luke and Ana
    service.transferFunds(luke, ana, Money('₿', 10), 'Transfer ₿20 from Luke to Ana')
    await service.minePendingTransactions(miner.address, 2)

    const anaBalance = service.calculateBalanceOfWallet(ana.address)

    lukeBalance = service.calculateBalanceOfWallet(luke.address)

    assert.isOk(
      anaBalance.equals((10).btc()),
      `Ana's balance should be ₿10.00 and was ${anaBalance}`
    )
    assert.isOk(
      lukeBalance.equals((9.8).btc()),
      `Luke's balance should be ₿9.8 and was ${lukeBalance}`
    )

    const isLedgerValid = ledger.validate()
    assert.isOk(isLedgerValid.isSuccess, 'Is ledger valid?')
  })
})
