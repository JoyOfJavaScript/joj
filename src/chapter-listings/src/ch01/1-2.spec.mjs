import BitcoinService from '@joj/blockchain/domain/service/BitcoinService.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import Builder from '@joj/blockchain/domain.js'
import Key from '@joj/blockchain/domain/value/Key.js'
import Money from '@joj/blockchain/domain/value/Money.js'
import Wallet from '@joj/blockchain/domain/Wallet.js'

import chai from 'chai'

const { assert } = chai

describe('1.2 - Blockchain transfers', () => {
    it('Shows a few transfers', async () => {
        const { Transaction2: TransactionBuilder } = Builder
        const { from, to, having, withDescription, signWith, build } = TransactionBuilder

        // Luke's digital wallet
        const luke = new Wallet(Key('luke-public.pem'), Key('luke-private.pem'))

        // Ana's digital wallet
        const ana = new Wallet(Key('ana-public.pem'), Key('ana-private.pem'))

        // Some miner's digital wallet
        const miner = new Wallet(Key('miner-public.pem'), Key('miner-private.pem'))

        let ledger = new Blockchain()

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
        ledger = await service.minePendingTransactions(miner.address, 2)

        console.log('Pending transactions', ledger.pendingTransactions);

        assert.equal(ledger.pendingTransactions.length, 1);

        const balance = miner.balance(ledger)

        // Balance is zero because the reward has not been mined in the blockchain
        assert.isOk(balance.equals((100).btc()))

        // Mine the next block to retrieve reward
        await service.minePendingTransactions(miner.address, 2)

        service.transferFunds(miner, luke, Money('₿', 20), 'Transfer ₿20 to Luke')
        await service.minePendingTransactions(miner.address, 2)

        let lukeBalance = luke.balance(ledger)
        console.log("Luke's balance is", lukeBalance)
        assert.isOk(lukeBalance.equals((20).btc()))

        const minerBalance = miner.balance(ledger)
        assert.isOk(minerBalance.equals((104.6).btc()), `Miner's balance is ${minerBalance}`)

        // Transfer funds between Luke and Ana
        service.transferFunds(luke, ana, Money('₿', 10), 'Transfer ₿20 from Luke to Ana')
        ledger = await service.minePendingTransactions(miner.address, 2)
        assert.equal(ledger.pendingTransactions.length, 1);

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
