import BlockService from './BlockService'
import Money from '../data/Money'
import Transaction from '../data/Transaction'
import TransactionalBlock from '../data/TransactionalBlock'
import Wallet from '../data/Wallet'
import { Combinators, Pair } from 'joj-adt'
import fs from 'fs'
import path from 'path'

// As of writing, current mining reward
const MINING_REWARD = Money('₿', 12.5)

const { curry } = Combinators

const BASE = path.join(__dirname, '../../..', 'blockchain-wallets')
const NETWORK = Wallet(
  fs.readFileSync(path.join(BASE, 'bitcoin-public.pem'), 'utf8'),
  fs.readFileSync(path.join(BASE, 'bitcoin-private.pem'), 'utf8'),
  'bitcoin'
)

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
  newBlock = BlockService.mineBlock(newBlock.difficulty, newBlock)
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
    // Ignore Genesis block as this won't ever have any pending transactions
    .filter(b => !b.isGenesis())
    // Retrieve all pending transactions
    .flatMap(txBlock => txBlock.pendingTransactions)
    // Separate the transactions into 2 groups:
    //    1: Matches the fromAddress
    //    2: Matches the toAddress
    .split(tx => tx.sender === address, tx => tx.recipient === address)
    // Now apply a function to each group to extract the amount to add/subtract as money
    .bimap(Array, Array)(
      arrA => arrA.map(tx => Money(tx.funds.currency, -tx.funds.amount)),
      arrB => arrB.map(tx => Money(tx.funds.currency, tx.funds.amount))
    )
    .merge((a, b) => a.concat(b))
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

// Proof of Work
const minePendingTransactions = curry((txBlockchain, address) => {
  // Reward is bigger when there are more transactions to process
  const fee =
    Math.abs(
      txBlockchain.pendingTransactions
        .filter(tx => tx.funds.amount < 0)
        .map(tx => tx.funds.amount)
        .reduce((a, b) => a + b, 0)
    ) *
    txBlockchain.pendingTransactions.length *
    0.02

  // Mine block and pass it all pending transactions in the chain
  // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
  // We keep transactions immutable by substracting similar transactions for the fee
  const block = mineBlockTo(
    txBlockchain,
    TransactionalBlock(txBlockchain.pendingTransactions)
  )

  // Reset pending transactions for this blockchain
  // Put fee transaction into the chain for next mining operation
  // Network will reward the first miner to mine the block with the transaction fee
  const tx = Transaction(
    NETWORK.address,
    address,
    Money.add(Money('₿', fee), MINING_REWARD)
  )
  tx.generateSignature(NETWORK.privateKey, NETWORK.passphrase)

  // After the transactions have been added to a block, reset them with the reward for the next miner
  txBlockchain.pendingTransactions = [tx]

  // Validate the entire chain
  BlockchainService.isChainValid(txBlockchain, true)
  return block
})

/**
 * Determines if the chain is valid by asserting the properties of a blockchain.
 * Namely:
 * 1. Every hash is unique and hasn't been tampered with
 * 2. Every block properly points to the previous block
 *
 * @param {Blockchain} blockchain Chain to calculate balance from
 * @param {boolean} checkTransactions Whether to check for transactions as well
 * @return {boolean} Whether the chain is valid
 */
const isChainValid = (blockchain, checkTransactions = false) =>
  blockchain
    // Skip the first one (the array will be off-by-one with respect to the blockchain)
    .slice(1)
    // Convert the resulting array into pairs of blocks Pair(current, previous)
    .map((currentBlock, currentIndex) =>
      Pair(Object, Object)(currentBlock, blockchain[currentIndex])
    )
    // Validate every pair of blocks is valid
    .every(pair => {
      const current = pair.left
      const previous = pair.right
      return (
        // 1 Hashed can't be tampered with
        current.hash === current.calculateHash() &&
        // 2. Blocks form a chain
        current.previousHash === previous.hash &&
        (checkTransactions
          ? // 3. Check is hash is solved
            current.hash.substring(0, current.difficulty) ===
              Array(current.difficulty)
                .fill(0)
                .join('') &&
            // 4. Verify Transaction signatures
            current.pendingTransactions.every(tx => tx.verifySignature())
          : true)
      )
    })

// eslint-disable-next-line max-statements
const transferFundsBetween = (txBlockchain, walletA, walletB, funds) => {
  // Check for enough funds
  const balanceA = BlockchainService.calculateBalanceOfAddress(
    txBlockchain,
    walletA.address
  )

  if (Money.compare(balanceA, funds) < 0) {
    throw new RangeError('Insufficient funds!')
  }
  const fee = Money.multiply(funds, Money('₿', 0.02))
  const transfer = Transaction(walletA.address, walletB.address, funds)
  transfer.generateSignature(walletA.privateKey, walletA.passphrase)

  // Sender pays the fee
  const txFee = Transaction(null, walletA.address, fee.asNegative())
  txFee.generateSignature(walletA.privateKey, walletA.passphrase)

  // Create new transactions in the blockchain representing the transfer and the fee
  txBlockchain.pendingTransactions.push(transfer, txFee)
  return transfer
}

/**
 * Exported BlockchainService interface
 */
const BlockchainService = {
  addBlockTo,
  mineBlockTo,
  isChainValid,
  minePendingTransactions,
  calculateBalanceOfAddress,
  transferFundsBetween,
}

export default BlockchainService
