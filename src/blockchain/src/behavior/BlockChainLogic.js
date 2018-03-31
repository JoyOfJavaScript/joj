import BlockLogic from './BlockLogic'
import { Combinators, Pair } from 'joj-adt'
import DataBlock from '../data/DataBlock'
import Money from '../data/Money'
import Transaction from '../data/Transaction'
import TransactionalBlock from '../data/TransactionalBlock'
import { concat } from '../common/helpers'
import fs from 'fs'

const { curry } = Combinators

const MINING_REWARD_SCORE = Money('₿', 100) // Represents the reward for mining the block

/**
 * Adds a new data block to the chain. It involves:
 * Recalculate new blocks hash and add the block to the chain
 * Point new block's previous to current
 *
 * @param {Blockchain} blockchain Chain to add block to
 * @param {Block}      newBlock   New block to add into the chain
 */
const addBlockTo = curry((blockchain, newBlock) => {
  newBlock.previousHash = blockchain.last().hash
  newBlock.calculateHash()
  blockchain.push(newBlock)
  return newBlock
})

/**
 * Mines a new block into the chain. It involves:
 * Recalculate new blocks hash until the difficulty condition is met (mine)
 * Point new block's previous to current
 *
 * @param {Blockchain}  blockchain Chain to add block to
 * @param {DataBlock}   newBlock   New block to add into the chain
 */
const mineBlockTo = curry((blockchain, newBlock) => {
  newBlock.previousHash = blockchain.last().hash
  newBlock = BlockLogic.mineBlock(newBlock.difficulty, newBlock)
  blockchain.push(newBlock)
  return newBlock
})

/**
 * Calculates the balance of the chain looking into all of the pending
 * transactions inside all the blocks in the chain
 *
 * @param {Blockchain} blockchain Chain to calculate balance from
 * @param {string}     address    Address to send reward to
 */
const calculateBalanceOfAddress = curry((blockchain, address) =>
  blockchain
    // Traverse all blocks
    .blocks()
    // Ignore Genesis block as this won't ever have any pending transactions
    .filter(b => !b.isGenesis())
    // Retrieve all pending transactions
    .map(txBlock => Array.from(txBlock.pendingTransactions.values()))
    // Group the transactions of each block into an array
    .reduce(concat)
    // Separate the transactions into 2 groups:
    //    1: Matches the fromAddress
    //    2: Matches the toAddress
    .split(tx => tx.sender === address, tx => tx.recipient === address)
    // Now apply a function to each group to extract the amount to add/subtract as money
    .bimap(Array, Array)(
      arrA => arrA.map(tx => Money(tx.funds.currency, -tx.funds.amount)),
      arrB => arrB.map(tx => Money(tx.funds.currency, tx.funds.amount))
    )
    .merge(concat)
    // Finally, add across all the values to compute sum
    // Money is monoidal over Money.add and Money.nothing
    .reduce(Money.add, Money.zero())
)

//-- IMPERATIVE VERSION OF calculateBalanceOfAddress --
//
// const calculateBalanceOfAddress = curry((blockchain, address) => {
//   let balance = Money.nothing()
//   for (const block of blockchain.blocks()) {
//     if (!block.isGenesis()) {
//       for (const trans of block.pendingTransactions) {
//         if (trans.fromAddress === address) {
//           balance = balance.minus(trans.money)
//         }
//         if (trans.toAddress === address) {
//           balance = balance.plus(trans.money)
//         }
//       }
//     }
//   }
//   return balance
// })

const minePendingTransactions = curry((txBlockchain, miningRewardAddress) => {
  // Mine block and pass it all pending transactions in the chain
  // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
  const block = mineBlockTo(
    txBlockchain,
    TransactionalBlock(txBlockchain.pendingTransactions)
  )

  // Reset pending transactions for this blockchain
  // Put reward transaction into the chain for next mining operation
  txBlockchain.pendingTransactions = [
    Transaction(null, miningRewardAddress, MINING_REWARD_SCORE),
  ]
  return block
})

/**
 * Determines if the chain is valid by asserting the properties of a blockchain.
 * Namely:
 * 1. Every hash is unique and hasn't been tampered with
 * 2. Every block properly points to the previous block
 *
 * @param {Blockchain} blockchain Chain to calculate balance from
 * @return {boolean} Whether the chain is valid
 */
const isChainValid = blockchain =>
  blockchain
    // Get all blocks
    .blocks()
    // Skip the first one (the array will be off-by-one with respect to the blockchain)
    .slice(1)
    // Convert the resulting array into pairs of blocks Pair(current, previous)
    .map((currentBlock, currentIndex) =>
      Pair(Object, Object)(currentBlock, blockchain.blockAt(currentIndex))
    )
    // Validate every pair of blocks is valid
    .every(pair => {
      const current = pair.left
      const previous = pair.right
      return (
        // 1 .Hashed can't be tampered with
        current.hash === DataBlock.calculateHash(current) &&
        // 2. Blocks form a chain
        current.previousHash === previous.hash
      )
    })

// eslint-disable-next-line max-statements
const transferFundsBetween = (txBlockchain, walletA, walletB, funds) => {
  // Check for enough funds
  const balanceA = BlockchainLogic.calculateBalanceOfAddress(
    txBlockchain,
    walletA.address
  )

  if (Money.compare(balanceA, funds) < 0) {
    throw new RangeError('Insufficient funds!')
  }

  const balanceB = BlockchainLogic.calculateBalanceOfAddress(
    txBlockchain,
    walletB.address
  )

  const txA = Transaction(
    null,
    walletA.publicKey,
    Money.subtract(balanceA, funds)
  )
  txA.generateSignature(walletA.privateKey, walletA.passphrase)
  txBlockchain.addPendingTransaction(txA)

  const txB = Transaction(null, walletB.publicKey, Money.add(balanceB, funds))
  txB.generateSignature(walletB.privateKey, walletB.passphrase)
  txBlockchain.addPendingTransaction(txB)

  // Create a block in the chain to reflect this transfer
  const block = addBlockTo(
    txBlockchain,
    TransactionalBlock(txBlockchain.pendingTransactions)
  )
  return block
}

/**
 * Exported BlockchainLogic interface
 */
const BlockchainLogic = {
  addBlockTo,
  mineBlockTo,
  isChainValid,
  minePendingTransactions,
  calculateBalanceOfAddress,
  transferFundsBetween,
}

export default BlockchainLogic
