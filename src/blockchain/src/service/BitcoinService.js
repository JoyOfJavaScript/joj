import 'core-js/fn/array/flat-map'
import { MINING_REWARD } from '../settings'
import Block from '../data/Block'
import Blockchain from '../data/Blockchain'
import Combinators from '@joj/adt/combinators'
import Funds from '../data/Funds'
import Money from '../data/Money'
import Transaction from '../data/Transaction'
import Wallet from '../data/Wallet'
import fs from 'fs'
import path from 'path'

const { curry } = Combinators

const BASE = path.join(__dirname, '../../..', 'blockchain-wallets')
const NETWORK = Wallet(
  fs.readFileSync(path.join(BASE, 'bitcoin-public.pem'), 'utf8'),
  fs.readFileSync(path.join(BASE, 'bitcoin-private.pem'), 'utf8'),
  'bitcoin'
)

const initLedger = () => {
  const g = DataBlock.genesis()
  g.hash = g.calculateHash()
  return Blockchain(g)
}

/**
 * Adds a new data block to the chain. It involves:
 * Recalculate new blocks hash and add the block to the chain
 * Point new block's previous to current
 *
 * @param {Blockchain} blockchain Chain to add block to
 * @param {Block}      newBlock   New block to add into the chain
 */
const addBlock = curry((blockchain, newBlock) => {
  newBlock.previousHash = blockchain.top().hash
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
const mineBlock = curry(async (blockchain, block) => {
  console.log(
    `Found ${block.countPendingTransactions()} pending transactions in block`
  )
  block.previousHash = blockchain.top().hash
  return blockchain.push(await block.mine())
})

/**
 * Calculates the balance of the chain looking into all of the pending
 * transactions inside all the blocks in the chain
 *
 * @param {Blockchain} blockchain Chain to calculate balance from
 * @param {string}     address    Address to send reward to
 */
const calculateBalanceOfWallet = curry((blockchain, address) => {
  let balance = Money.zero()
  for (const block of blockchain) {
    if (!block.isGenesis()) {
      for (const trans of block.pendingTransactions) {
        if (trans.sender === address) {
          balance = balance.minus(trans.money)
        }
        if (trans.recipient === address) {
          balance = balance.plus(trans.money)
        }
      }
    }
  }
  return balance.round()
})

// Proof of Work
const minePendingTransactions = curry(async (ledger, address) =>
  // Mine block and pass it all pending transactions in the chain
  // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
  // We keep transactions immutable by substracting similar transactions for the fee
  mineBlock(ledger, Block(ledger.pendingTransactions)).then(block => {
    // Reward is bigger when there are more transactions to process
    const fee =
      Math.abs(
        ledger.pendingTransactions
          .filter(tx => tx.amount < 0)
          .map(tx => tx.amount)
          .reduce((a, b) => a + b, 0)
      ) *
      ledger.pendingTransactions.length *
      0.02

    // Reset pending transactions for this blockchain
    // Put fee transaction into the chain for next mining operation
    // Network will reward the first miner to mine the block with the transaction fee
    const tx = Transaction(
      NETWORK.address,
      address,
      Funds(Money.add(Money('₿', fee), MINING_REWARD)),
      'Mining Reward'
    )
    tx.signature = tx.generateSignature(NETWORK.privateKey)

    // After the transactions have been added to a block, reset them with the reward for the next miner
    ledger.pendingTransactions = [tx]

    // Validate the entire chain
    BitcoinService.isLedgerValid(ledger, true)

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
// TODO: Use an iterator to check all blocks instead of toArray. Delete toArray method and use ...blockchain to invoke the iterator
// TODO: You can use generators to run a simulation
const isLedgerValid = (blockchain, checkTransactions = false) =>
  [...validateBlockchain(blockchain, checkTransactions)].reduce(
    (a, b) => a && b
  )

const validateBlockchain = (blockchain, alsoCheckTransactions) => {
  return {
    [Symbol.iterator]: function * () {
      for (const currentBlock of blockchain) {
        if (currentBlock.isGenesis()) {
          yield true
        } else {
          // Compare each block with its previous
          const previousBlock = blockchain.lookUp(currentBlock.previousHash)
          yield validateBlock(
            currentBlock,
            previousBlock,
            alsoCheckTransactions
          )
        }
      }
    }
  }
}

const validateBlock = (current, previous, checkTransactions) =>
  // 0. Check hash valid
  current.hash.length > 0 &&
  previous.hash.length > 0 &&
  // 1. Check hash tampering
  current.hash.equals(current.calculateHash()) &&
  // 2. Check blocks form a properly linked chain using hashes
  current.previousHash.equals(previous.hash) &&
  // 3. Check timestamps
  current.timestamp >= previous.timestamp &&
  // 4. Verify Transaction signatures
  (checkTransactions ? checkBlockTransactions(current) : true)

const checkBlockTransactions = block =>
  block.hash.toString().substring(0, block.difficulty) ===
    Array(block.difficulty).fill(0).join('') &&
  block.pendingTransactions.every(tx => tx.verifySignature())

// eslint-disable-next-line max-statements
const transferFunds = (txBlockchain, walletA, walletB, funds) => {
  // Check for enough funds
  const balanceA = BitcoinService.calculateBalanceOfWallet(
    txBlockchain,
    walletA.address
  )

  if (Money.compare(balanceA, funds) < 0) {
    throw new RangeError('Insufficient funds!')
  }
  const fee = Money.multiply(funds, Money('₿', 0.02))
  const transfer = Transaction(walletA.address, walletB.address, Funds(funds))
  transfer.signature = transfer.generateSignature(walletA.privateKey)

  // Sender pays the fee
  const txFee = Transaction(walletA.address, NETWORK.address, Funds(fee))
  txFee.signature = txFee.generateSignature(walletA.privateKey)

  // Add new pending transactions in the blockchain representing the transfer and the fee
  txBlockchain.pendingTransactions.push(transfer, txFee)
  return transfer
}

/**
 * Exported BitcoinService interface
 */
const BitcoinService = {
  initLedger,
  addBlock,
  mineBlock,
  isLedgerValid,
  minePendingTransactions,
  calculateBalanceOfWallet,
  transferFunds
}
export default BitcoinService
module.exports = BitcoinService // TODO: using export default will result in default: {} object within the import
