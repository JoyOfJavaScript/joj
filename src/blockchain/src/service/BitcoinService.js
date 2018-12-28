import Block from '../data/Block'
import { MINING_REWARD } from '../settings'
import Money from '../data/value/Money'
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
      )
    )
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
      `Found ${
        newBlock.pendingTransactions.length
      } pending transactions in block`
    )
    newBlock.previousHash = this.ledger.top().hash
    return this.ledger.push(await newBlock.mine())
  }

  /**
   * (Imperative version)
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

  // Proof of Work
  async minePendingTransactions (address) {
    // Mine block and pass it all pending transactions in the chain
    // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
    // We keep transactions immutable by substracting similar transactions for the fee
    return this.mineBlock(Block(null, this.ledger.pendingTransactions)).then(
      block => {
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
          Money.sum(Money('₿', fee), MINING_REWARD),
          'Mining Reward'
        )
        reward.signature = reward.generateSignature(this.network.privateKey)
        reward.hash = reward.calculateHash()

        // After the transactions have been added to a block, reset them with the reward for the next miner
        this.ledger.pendingTransactions = [reward]

        // Validate the entire chain
        this.ledger.validate()

        return block
      }
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
      funds,
      description
    )
    transfer.signature = transfer.generateSignature(walletA.privateKey)
    transfer.hash = transfer.calculateHash()
    // Sender pays the fee
    const txFee = Transaction(
      walletA.address,
      this.network.address,
      fee,
      'Transaction Fee'
    )
    txFee.signature = txFee.generateSignature(walletA.privateKey)
    txFee.hash = txFee.calculateHash()

    // Add new pending transactions in the blockchain representing the transfer and the fee
    this.ledger.pendingTransactions.push(transfer, txFee)
    return transfer
  }

  writeLedger (filename) {
    const toArray = a => a.toArray()
    const jsonString = a => JSON.stringify(a.toJSON())
    const csv = arr => arr.map(jsonString).join(',')
    const buffer = str => Buffer.from(str, 'utf8')
    const write = buff => fs.writeFileSync(filename, buff)
    return write(buffer(csv(toArray(this.ledger))))
  }
}
export default BitcoinService
