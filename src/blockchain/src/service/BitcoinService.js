import Block from '../data/Block'
import Funds from '../data/Funds'
import { MINING_REWARD } from '../settings'
import Money from '../data/Money'
import Transaction from '../data/Transaction'
import Wallet from '../data/Wallet'
import fs from 'fs'
import path from 'path'

class BitcoinService {
  static BASE = path.join(__dirname, '../../..', 'blockchain-wallets')

  /**
   * Constructs a BitcoinService instance with the specified blockchain ledger
   * @param {Blockchain} ledger Ledger to manage
   */
  constructor (ledger) {
    this.ledger = ledger
    this.network = Wallet(
      fs.readFileSync(
        path.join(BitcoinService.BASE, 'bitcoin-public.pem'),
        'utf8'
      ),
      fs.readFileSync(
        path.join(BitcoinService.BASE, 'bitcoin-private.pem'),
        'utf8'
      ),
      'bitcoin'
    )
  }
  /**
   * Adds a new data block to the chain. It involves:
   * Recalculate new blocks hash and add the block to the chain
   * Point new block's previous to current
   *
   * @param {Block}      newBlock   New block to add into the chain
   * @return {Block} Returns the new block added
   */
  addBlock (newBlock) {
    newBlock.previousHash = this.ledger.top().hash
    newBlock.hash = newBlock.calculateHash(
      newBlock.pendingTransactionsToString()
    )
    this.ledger.push(newBlock)
    return newBlock
  }

  /**
   * Mines a new block into the chain. It involves:
   * Recalculate new blocks hash until the difficulty condition is met (mine)
   * Point new block's previous to current
   *
   * @param {Block}       newBlock   New block to add into the chain
   * @return {Block} Returns new block mined into the blockchain
   */
  async mineBlock (newBlock) {
    console.log(
      `Found ${newBlock.countPendingTransactions()} pending transactions in block`
    )
    newBlock.previousHash = this.ledger.top().hash
    return this.ledger.push(await newBlock.mine())
  }

  /**
   * Calculates the balance of the chain looking into all of the pending
   * transactions inside all the blocks in the chain
   *
   * @param {string}     address  Address to send reward to
   * @return {Money} Returns the user's total balance
   */
  calculateBalanceOfWallet (address) {
    let balance = Money.zero()
    for (const block of this.ledger) {
      if (!block.isGenesis()) {
        for (const tx of block.pendingTransactions) {
          if (tx.sender === address) {
            balance = balance.minus(tx.money())
          }
          if (tx.recipient === address) {
            balance = balance.plus(tx.money())
          }
        }
      }
    }
    return balance.round()
  }

  // Proof of Work
  async minePendingTransactions (address) {
    // Mine block and pass it all pending transactions in the chain
    // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
    // We keep transactions immutable by substracting similar transactions for the fee
    return this.mineBlock(
      Block(this.ledger.pendingTransactions)
    ).then(block => {
      // Reward is bigger when there are more transactions to process
      const fee =
        Math.abs(
          this.ledger.pendingTransactions
            .filter(tx => tx.amount() < 0)
            .map(tx => tx.amount())
            .reduce((a, b) => a + b, 0)
        ) *
        this.ledger.pendingTransactions.length *
        0.02

      // Reset pending transactions for this blockchain
      // Put fee transaction into the chain for next mining operation
      // Network will reward the first miner to mine the block with the transaction fee
      const reward = Transaction(
        this.network.address,
        address,
        Funds(Money.add(Money('₿', fee), MINING_REWARD)),
        'Mining Reward'
      )
      reward.signature = reward.generateSignature(this.network.privateKey)
      reward.hash = reward.calculateHash()

      // After the transactions have been added to a block, reset them with the reward for the next miner
      this.ledger.pendingTransactions = [reward]

      // Validate the entire chain
      this.isLedgerValid(true)

      return block
    })
  }

  /**
   * Determines if the chain is valid by asserting the properties of a blockchain.
   * Namely:
   * 1. Every hash is unique and hasn't been tampered with
   * 2. Every block properly points to the previous block
   *
   * @param {boolean} checkTransactions Whether to check for transactions as well
   * @return {boolean} Whether the chain is valid
   */
  // TODO: Use an iterator to check all blocks instead of toArray. Delete toArray method and use ...blockchain to invoke the iterator
  // TODO: You can use generators to run a simulation
  isLedgerValid (checkTransactions = false) {
    return [...validateBlockchain(this.ledger, checkTransactions)].reduce(
      (a, b) => a && b
    )
  }

  // eslint-disable-next-line max-statements
  transferFunds (walletA, walletB, funds, description) {
    // Check for enough funds
    const balanceA = this.calculateBalanceOfWallet(walletA.address)

    if (Money.compare(balanceA, funds) < 0) {
      throw new RangeError('Insufficient funds!')
    }
    const fee = Money.multiply(funds, Money('₿', 0.02))
    const transfer = Transaction(
      walletA.address,
      walletB.address,
      Funds(funds),
      description
    )
    transfer.signature = transfer.generateSignature(walletA.privateKey)
    transfer.hash = transfer.calculateHash()
    // Sender pays the fee
    const txFee = Transaction(walletA.address, this.network.address, Funds(fee))
    txFee.signature = txFee.generateSignature(walletA.privateKey)
    txFee.hash = txFee.calculateHash()

    // Add new pending transactions in the blockchain representing the transfer and the fee
    this.ledger.pendingTransactions.push(transfer, txFee)
    return transfer
  }
}

const validateBlockchain = (blockchain, alsoCheckTransactions) => ({
  [Symbol.iterator]: function * () {
    for (const currentBlock of blockchain) {
      if (currentBlock.isGenesis()) {
        yield true
      } else {
        // Compare each block with its previous
        const previousBlock = blockchain.lookUp(currentBlock.previousHash)
        yield validateBlock(currentBlock, previousBlock, alsoCheckTransactions)
      }
    }
  }
})

const validateBlock = (current, previous, checkTransactions) =>
  // 0. Check hash valid
  current.hash.length > 0 &&
  previous.hash.length > 0 &&
  // 1. Check hash tampering
  current.hash.equals(
    current.calculateHash(current.pendingTransactionsToString())
  ) &&
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

export default BitcoinService
