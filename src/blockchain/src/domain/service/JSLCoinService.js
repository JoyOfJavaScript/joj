import { buffer, join, toArray, toJson } from '~util/helpers.js'
import Builder from '../../domain.js'
import Key from '../value/Key.js'
import Money from '../value/Money.js'
import Transaction from '../Transaction.js'
import Wallet from '../Wallet.js'

/**
 * Constructs a JSLCoinService instance with the specified blockchain ledger
 * @param {Blockchain} ledger Ledger to manage
 * @return {JSLCoinService} New service instance
 */
const JSLCoinService = ledger => {
  const network = new Wallet(Key('jsl-public.pem'), Key('jsl-private.pem'))

  return {
    [Symbol.toStringTag]: 'JSLCoinService',
    mineNewBlockIntoChain,
    calculateBalanceOfWallet,
    minePendingTransactions,
    transferFunds,
    serializeLedger
  }

  /**
   * Mines a new block into the chain. It involves:
   * Recalculate new blocks hash until the difficulty condition is met (mine)
   * Point new block's previous to current
   *
   * @param {Block}  newBlock  New block to add into the chain   
   * @return {Blockchain} Returns a reference to the blockchain with the new block inserted
   */
  async function mineNewBlockIntoChain(newBlock) {
    console.log(`Found ${newBlock.data.length} pending transactions in block`)
    // Check that this block index does not already exist
    // if (ledger.lookUpByIndex(newBlock.index)) {
    //   throw new Error('Block rejected since it had already been mined!')
    // }    
    let proofOfWorkModule
    switch (newBlock[Symbol.for('version')]) {
      case '2.0': {
        proofOfWorkModule = await import('./jslcoinservice/proof_of_work3.js')
        break;
      }
      default: case '1.0':
        proofOfWorkModule = await import('./jslcoinservice/proof_of_work2.js')
        break;
    }
    const { proofOfWork } = proofOfWorkModule
    ledger.push(await proofOfWork(newBlock, ''.padStart(newBlock.difficulty, '0')))
    return ledger
  }


  /**
   * (Imperative version)
   * Calculates the balance of the chain looking into all of the pending
   * transactions inside all the blocks in the chain
   *
   * @param {string}     address  Address to send reward to
   * @return {Money} Returns the user's total balance
   */
  function calculateBalanceOfWallet(address) {
    let balance = Money.zero()
    for (const block of ledger) {
      if (!block.isGenesis()) {
        for (const tx of block.data) {
          if (tx.sender === address) {
            balance = balance.minus(tx.funds)
          }
          if (tx.recipient === address) {
            balance = balance.plus(tx.funds)
          }
        }
      }
    }
    return balance.round()
  }

  /**
   * Mine transactions into a new block
   * @param {string} rewardAddress Address that will receive the reward for the mining process
   * @param {number} proofOfWorkDifficulty Difficulty factor for the proof of work function (default difficulty of 2)
   * @return {Promise<void>} New mined block
   */
  // async function minePendingTransactions(rewardAddress, proofOfWorkDifficulty = 2) {
  //   console.log('Mining pending transactions...')
  //   // Mine block and pass it all pending transactions in the chain
  //   // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
  //   // We keep transactions immutable by substracting similar transactions for the fee
  //   await mineNewBlockIntoChain(
  //     new Builder.Block()
  //       .at(ledger.height() + 1)
  //       .linkedTo(ledger.top.hash)
  //       .withPendingTransactions(ledger.pendingTransactions)
  //       .withDifficulty(proofOfWorkDifficulty)
  //       .build()
  //   )

  //   // Validate the entire chain
  //   console.log('Validating entire chain...')
  //   const chainValidation = ledger.validate()
  //   if (chainValidation.isFailure) {
  //     // if validation fails, exit and don't reward anyone
  //     throw new Error(`Chain validation failed ${chainValidation.toString()}`)
  //   }

  //   // Reward is bigger when there are more transactions to process
  //   const fee =
  //     Math.abs(
  //       ledger.pendingTransactions
  //         .filter(tx => tx.amount() < 0)
  //         .map(tx => tx.amount())
  //         .reduce((a, b) => a + b, 0)
  //     ) *
  //     ledger.pendingTransactions.length *
  //     0.02

  //   console.log('Adding fee transaction to set of pending transctions...')
  //   // Reset pending transactions for this blockchain
  //   // Put fee transaction into the chain for next mining operation
  //   // Network will reward the first miner to mine the block with the transaction fee
  //   const { MINING_REWARD } = await import('../../common/settings.js')
  //   const reward = new Transaction(
  //     network.address,
  //     rewardAddress,
  //     Money.sum(Money('jsl', fee), MINING_REWARD),
  //     'Mining Reward'
  //   )
  //   reward.signTransaction(network.privateKey)

  //   // After the transactions have been added to a block, reset them with the reward for the next miner
  //   ledger.pendingTransactions = [reward]
  // }

  // Promise-based implementation of minePendingTransactions
  function minePendingTransactions(rewardAddress, proofOfWorkDifficulty = 2) {
    return mineNewBlockIntoChain(
      new Builder.Block()
        .at(ledger.height() + 1)
        .linkedTo(ledger.top.hash)
        .withPendingTransactions(ledger.pendingTransactions)
        .withDifficulty(proofOfWorkDifficulty)
        .build()
    )
      .then(:: ledger.validate)
      //  => {
      //   return ledger.validate()
      // })
      .then(validation => {
        if (validation.isSuccess) {
          return import('../../common/settings.js')
            .then(({ MINING_REWARD }) => {
              const fee =
                Math.abs(
                  ledger.pendingTransactions
                    .filter(tx => tx.amount() < 0)
                    .map(tx => tx.amount())
                    .reduce((a, b) => a + b, 0)
                ) *
                ledger.pendingTransactions.length *
                0.02

              const reward = new Transaction(
                network.address,
                rewardAddress,
                Money.sum(Money('jsl', fee), MINING_REWARD),
                'Mining Reward'
              )
              reward.signTransaction(network.privateKey)

              ledger.pendingTransactions = [reward]
            })
        }
        else {
          new Error(`Chain validation failed ${validation.toString()}`)
        }
      })
  }


  // eslint-disable-next-line max-statements
  function transferFunds(walletA, walletB, funds, description, transferFee = 0.02) {
    console.log(`Executing transaction ${description}`)

    if (Money.compare(walletA.balance(ledger), funds) < 0) {
      throw new RangeError(`Insufficient funds for address ${walletA.address}`)
    }

    return ledger.pendingTransactions.push(
      new Builder.Transaction()
        .from(walletA.address)
        .to(walletB.address)
        .having(funds)
        .withDescription(description)
        .signWith(walletA.privateKey)
        .build(),
      new Builder.Transaction()
        .from(walletA.address)
        .to(network.address)
        .having(Money.multiply(funds, Money('jsl', transferFee)))
        .withDescription('Transaction Fee')
        .signWith(walletA.privateKey)
        .build()
    )
  }

  function serializeLedger(delimeter = ';') {

    return ledger |> toArray |> join(toJson, delimeter) |> buffer
    // return compose(buffer, csv(toJson), toArray)(ledger)
  }
}

// Helpers
function validateLedger(ledger) {
  return new Promise((resolve, reject) => {
    const chainValidation = ledger.validate()
    if (chainValidation.isFailure) {
      reject(new Error(`Chain validation failed ${chainValidation.toString()}`))
    }
    resolve(ledger)
  })
}

export default JSLCoinService
