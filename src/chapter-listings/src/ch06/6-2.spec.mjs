import '@joj/blockchain/domain/value/Money.js'
import { compose, prop, props } from '@joj/blockchain/util/fp/combinators.js'
import Blockchain from '@joj/blockchain/domain/Blockchain.js'
import assemble from '@joj/blockchain/domain/shared/has_hash/assemble.js'
import chai from 'chai'
import computeCipher from '@joj/blockchain/domain/shared/has_hash/compute_cipher.js'

const { assert } = chai

describe('6.2 -  Module patterns', () => {
  it('1. Object namespaces', () => {
    const BlockchainApp = global.BlockchainApp || {} //#A
    //Using an object namespace
    {
      BlockchainApp.domain = {} //#B
      BlockchainApp.domain.Transaction = (function () {
        const feePercent = 0.6 //#C

        function precisionRound(number, precision) {
          const factor = Math.pow(10, precision)
          return Math.round(number * factor) / factor
        }

        return {
          //#D
          construct: function (sender, recipient, funds = 0.0) {
            this.sender = sender
            this.recipient = recipient
            this.funds = Number(funds)
            return this
          },
          netTotal: function () {
            return precisionRound(this.funds * feePercent, 2)
          }
        }
      })()
      const tx = BlockchainApp.domain.Transaction.construct('luis', 'luke', 10)
      assert.equal(tx.netTotal(), 6)
    }

    //Using a class
    {
      BlockchainApp.domain.Transaction = class {
        //#A
        #feePercent = 0.6
        constructor(sender, recipient, funds = 0.0) {
          this.sender = sender
          this.recipient = recipient
          this.funds = Number(funds)
          this.timestamp = Date.now()
        }

        static precisionRound(number, precision) {
          const factor = Math.pow(10, precision)
          return Math.round(number * factor) / factor
        }

        netTotal() {
          return BlockchainApp.domain.Transaction.precisionRound(this.funds * this.#feePercent, 2)
        }
      }
      const tx = new BlockchainApp.domain.Transaction('luis', 'luke', 10)
      assert.equal(tx.netTotal(), 6)
    }
  })
  it('2. Immediately-Invoked Function Expressions (IIFEs)', () => {
    (function Transaction(namespace) {
      const VERSION = '1.0' //#A
      namespace.domain = {} //#B

      namespace.domain.Transaction = class {
        //#C
        #feePercent = 0.6

        constructor(sender, recipient, funds = 0.0) {
          this.sender = sender
          this.recipient = recipient
          this.funds = Number(funds)
          this.timestamp = Date.now()
          this.transactionId = calculateHash(
            //#D
            [this.sender, this.recipient, this.funds].join()
          )
        }
      }

      function calculateHash(data) {
        let hash = 0
        let i = 0
        while (i < data.length) {
          hash = ((hash << 5) - hash + data.charCodeAt(i++)) << 0
        }
        return hash ** 2
      }
    })(global.BlockchainApp || (global.BlockchainApp = {})) //#F

    const tx = new global.BlockchainApp.domain.Transaction('luis', 'luke', 10)
    assert.equal(tx.transactionId, 90047400839578080)
  })
  it('3. IIFE mixins', () => {
    const BlockchainApp = {}
    BlockchainApp.domain = {}
    BlockchainApp.domain.Transaction = class {
      //#A
      #feePercent = 0.6
      constructor(sender, recipient, funds = 0.0) {
        this.sender = sender
        this.recipient = recipient
        this.funds = Number(funds)
        this.timestamp = Date.now()
        this.transactionId = this.calculateHash(
          //#D
          [this.sender, this.recipient, this.funds].join()
        )
      }

      static precisionRound(number, precision) {
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
      }

      netTotal() {
        return BlockchainApp.domain.Transaction.precisionRound(this.funds * this.#feePercent, 2)
      }
    }

    const HasHash =
      global.HasHash ||
      function HasHash(keys) {
        const options = {
          algorithm: 'SHA256',
          encoding: 'hex'
        }

        this.calculateHash = () => {
          // #A
          const objToHash = Object.fromEntries(new Map(keys.map(k => [k, prop(k, this)])))
          return compose(
            computeCipher(options),
            assemble,
            props(keys)
          )(objToHash)
        }
      }

    HasHash.call(BlockchainApp.domain.Transaction.prototype, [
      'sender',
      'recipient',
      'funds',
      'timestamp'
    ])
    const tx = new BlockchainApp.domain.Transaction('luis', 'luke', 10)
    assert.equal(
      tx.transactionId,
      '6cd8cec706fa11110d83fb46f97df1f9be43b4c570f3390e7c7f6a5173f595e6'
    )
  })
  it('4. Factory functions (structure only)', () => {
    /* 
      This test just asserts the structure of the object. Due to the complexity involved
      testing this service, you can visit the blockchain project in the repository for more
      comprehensive testing of the functionality
    */
    const BitcoinService = ledger => {
      //#A
      //const network = new Wallet(Key('jsl-public.pem'), Key('jsl-private.pem')) //#A

      return {
        mineNewBlockIntoChain,
        minePendingTransactions,
        transferFunds
      }

      async function mineNewBlockIntoChain(newBlock) {
        //#B
        //...
      }

      async function minePendingTransactions(
        rewardAddress, //#C
        proofOfWorkDifficulty = 2
      ) {
        //...
      }

      function transferFunds(walletA, walletB, funds, description) {
        //#D
        //...
        assert.isNotNull(walletA)
        assert.isNotNull(walletB)
        assert.equal(funds.currency, '₿')
        assert.isNotEmpty(description)
        console.log('Running', arguments[3])
      }
    }
    const service = BitcoinService(new Blockchain())
    assert.isNotNull(service.mineNewBlockIntoChain)
    assert.isNotNull(service.minePendingTransactions)
    assert.isNotNull(service.transferFunds)

    const transfers = [
      ['luke', 'ana', (5).btc(), 'Transfer 5 JSL from Luke to Ana'],
      ['ana', 'luke', (2.5).btc(), 'Transfer 2.5 JSL from Ana to Luke'],
      ['ana', 'matt', (10).btc(), 'Transfer 10 JSL from Ana to Matthew'],
      ['matt', 'luke', (20).btc(), 'Transfer 20 JSL from Matthew to Luke']
    ]

    function runBatchTransfers(transfers, batchOperation) {
      transfers.map(transferData => batchOperation(...transferData))
    }

    const { transferFunds } = service

    runBatchTransfers(transfers, transferFunds) //#A
  })
})
