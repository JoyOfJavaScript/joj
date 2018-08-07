import BlockService from './BlockService'
import Blockchain from '../data/Blockchain'
import Combinators from '@joj/adt/combinators'
import Money from '../data/Money'
import Pair from '@joj/adt/pair'
import Transaction from '../data/Transaction'
import TransactionalBlock from '../data/TransactionalBlock'
import Wallet from '../data/Wallet'
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

const newBlockchain = () => Blockchain.init()

/**
 * Adds a new data block to the chain. It involves:
 * Recalculate new blocks hash and add the block to the chain
 * Point new block's previous to current
 *
 * @param {Blockchain} blockchain Chain to add block to
 * @param {Block}      newBlock   New block to add into the chain
 */
const addBlock = curry((blockchain, newBlock) => {
  newBlock.previousHash = blockchain.last().hash
  newBlock.hash = newBlock.calculateHash()
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
const mineBlock = curry(async (blockchain, newBlock) => {
  let block = newBlock
  block.previousHash = blockchain.last().hash
  block = await BlockService.mineBlock(block.difficulty, block)
  blockchain.push(block)
  return block
})

/**
 * Calculates the balance of the chain looking into all of the pending
 * transactions inside all the blocks in the chain
 *
 * @param {Blockchain} blockchain Chain to calculate balance from
 * @param {string}     address    Address to send reward to
 */
const calculateBalanceOfWallet = curry((blockchain, address) => {
  const transactions = blockchain
    .toArray()
    // Ignore Genesis block as this won't ever have any pending transactions
    .filter(b => !b.isGenesis())
    // Retrieve all pending transactions
    .flatMap(txBlock => txBlock.pendingTransactions)

  // Separate the transactions into 2 groups:
  //    1: Matches the fromAddress
  //    2: Matches the toAddress
  return (
    Pair.split(
      tx => tx.sender === address,
      tx => tx.recipient === address,
      transactions
    )
      // Now apply a function to each group to extract the amount to add/subtract as money
      .bimap(Array, Array)(
        arrA => arrA.map(tx => Money(tx.funds.currency, -tx.funds.amount)),
        arrB => arrB.map(tx => Money(tx.funds.currency, tx.funds.amount))
      )
      .merge((a, b) => [...a, ...b])
      // Finally, add across all the values to compute sum
      // Money is monoidal over Money.add and Money.nothing
      .reduce(Money.add, Money.zero())
  )
})

// -- IMPERATIVE VERSION OF calculateBalanceOfAddress --
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
const minePendingTransactions = curry(async (txBlockchain, address) =>
  // Mine block and pass it all pending transactions in the chain
  // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
  // We keep transactions immutable by substracting similar transactions for the fee
  mineBlock(
    txBlockchain,
    TransactionalBlock(txBlockchain.pendingTransactions)
  ).then(block => {
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

    // Reset pending transactions for this blockchain
    // Put fee transaction into the chain for next mining operation
    // Network will reward the first miner to mine the block with the transaction fee
    const tx = Transaction(
      NETWORK.address,
      address,
      Money.add(Money('₿', fee), MINING_REWARD)
    )
    tx.signature = tx.generateSignature(NETWORK.privateKey)

    // After the transactions have been added to a block, reset them with the reward for the next miner
    txBlockchain.pendingTransactions = [tx]

    // Validate the entire chain
    BlockchainService.isChainValid(txBlockchain, true)

    return block
  })
)

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
    .toArray()
    // Skip the first one (the array will be off-by-one with respect to the blockchain)
    .slice(1)
    // Convert the resulting array into pairs of blocks Pair(current, previous)
    .map((currentBlock, currentIndex) =>
      Pair(Object, Object)(currentBlock, blockchain.blockAt(currentIndex))
    )
    // Validate every pair of blocks is valid
    .every(([current, previous]) =>
      checkBlocks(checkTransactions, current, previous)
    )

const checkBlocks = (checkTransactions, current, previous) =>
  // 1 Check hash tampering
  current.hash.equals(current.calculateHash()) &&
  // 2. Check blocks form a properly linked chain using hashes
  current.previousHash.equals(previous.hash) &&
  // 3. Check timestamps
  current.timestamp >= previous.timestamp &&
  // 4. Check is hash is solved
  (checkTransactions
    ? current.hash.toString().substring(0, current.difficulty) ===
        Array(current.difficulty).fill(0).join('') &&
        // 5. Verify Transaction signatures
        current.pendingTransactions.every(tx => tx.verifySignature())
    : true)

// eslint-disable-next-line max-statements
const transferFunds = (txBlockchain, walletA, walletB, funds) => {
  // Check for enough funds
  const balanceA = BlockchainService.calculateBalanceOfWallet(
    txBlockchain,
    walletA.address
  )

  if (Money.compare(balanceA, funds) < 0) {
    throw new RangeError('Insufficient funds!')
  }
  const fee = Money.multiply(funds, Money('₿', 0.02))
  const transfer = Transaction(walletA.address, walletB.address, funds)
  transfer.signature = transfer.generateSignature(walletA.privateKey)

  // Sender pays the fee
  const txFee = Transaction(null, walletA.address, fee.asNegative())
  txFee.signature = txFee.generateSignature(walletA.privateKey)

  // Create new transactions in the blockchain representing the transfer and the fee
  txBlockchain.pendingTransactions.push(transfer, txFee)
  return transfer
}

/**
 * Exported BlockchainService interface
 */
const BlockchainService = {
  addBlock,
  mineBlock,
  isChainValid,
  minePendingTransactions,
  calculateBalanceOfWallet,
  transferFunds,
  newBlockchain
}
export default BlockchainService
module.exports = BlockchainService // TODO: using export default will result in default: {} object within the import
