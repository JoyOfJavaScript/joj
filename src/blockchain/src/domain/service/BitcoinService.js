import Block from '../Block'
import Key from '../value/Key'
import Money from '../value/Money'
import Transaction from '../Transaction'
import Wallet from '../Wallet'
import fs from 'fs'
import proofOfWork from './bitcoinservice/proof_of_work2'

class BitcoinService {
  #ledger
  #network
  /**
   * Constructs a BitcoinService instance with the specified blockchain ledger
   * @param {Blockchain} ledger Ledger to manage
   */
  constructor(ledger) {
    this.#ledger = ledger
    this.#network = new Wallet(Key('jsl-public.pem'), Key('jsl-private.pem'))
  }

  /**
   * Mines a new block into the chain. It involves:
   * Recalculate new blocks hash until the difficulty condition is met (mine)
   * Point new block's previous to current
   *
   * @param {Block}  newBlock  New block to add into the chain
   * @param {number} proofOfWorkDifficulty Difficulty factor for proof of work function (default: 2)
   * @return {Block} Returns new block mined into the blockchain
   */
  async mineNewBlockIntoChain(newBlock) {
    console.log(`Found ${newBlock.transactions.length} pending transactions in block`)
    // Check that this block index does not already exist
    if (this.#ledger.lookUpByIndex(newBlock.index)) {
      throw new Error('Block rejected since it had already been mined!')
    }
    return this.#ledger.push(await proofOfWork(newBlock, ''.padStart(newBlock.difficulty, '0')))
  }

  /**
   * (Imperative version)
   * Calculates the balance of the chain looking into all of the pending
   * transactions inside all the blocks in the chain
   *
   * @param {string}     address  Address to send reward to
   * @return {Money} Returns the user's total balance
   */
  calculateBalanceOfWallet(address) {
    let balance = Money.zero()
    for (const block of this.#ledger) {
      if (!block.isGenesis()) {
        for (const tx of block.transactions) {
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
   * @return {Block} New mined block
   */
  async minePendingTransactions(rewardAddress, proofOfWorkDifficulty = 2) {
    console.log('Mining pending transactions...')
    // Mine block and pass it all pending transactions in the chain
    // In reality, blocks are not to exceed 1MB, so not all tx are sent to all blocks
    // We keep transactions immutable by substracting similar transactions for the fee
    const previousHash = this.#ledger.top.hash
    const nextId = this.#ledger.height() + 1
    const block = await this.mineNewBlockIntoChain(
      new Block(nextId, previousHash, this.#ledger.pendingTransactions, proofOfWorkDifficulty)
    )

    // Validate the entire chain
    const chainValidation = this.#ledger.validate()
    if (chainValidation.isFailure) {
      // if validation fails, exit and don't reward anyone
      throw new Error(`Chain validation failed ${chainValidation.toString()}`)
    }

    // Reward is bigger when there are more transactions to process
    const fee =
      Math.abs(
        this.#ledger.pendingTransactions
          .filter(tx => tx.amount() < 0)
          .map(tx => tx.amount())
          .reduce((a, b) => a + b, 0)
      ) *
      this.#ledger.pendingTransactions.length *
      0.02

    // Reset pending transactions for this blockchain
    // Put fee transaction into the chain for next mining operation
    // Network will reward the first miner to mine the block with the transaction fee
    const { MINING_REWARD } = await import('../../common/settings')
    const reward = new Transaction(
      this.#network.address,
      rewardAddress,
      Money.sum(Money('jsl', fee), MINING_REWARD),
      'Mining Reward'
    )
    reward.signature = reward.sign(this.#network.privateKey)

    // After the transactions have been added to a block, reset them with the reward for the next miner
    this.#ledger.pendingTransactions = [reward]

    return block
  }

  // eslint-disable-next-line max-statements
  transferFunds(walletA, walletB, funds, description) {
    console.log(`Executing transaction ${description}`)
    // Check for enough funds
    const balanceA = this.calculateBalanceOfWallet(walletA.address)

    if (Money.compare(balanceA, funds) < 0) {
      throw new RangeError(`Insufficient funds for address ${walletA.address}`)
    }
    const fee = Money.multiply(funds, Money('jsl', 0.02))
    const transfer = new Transaction(walletA.address, walletB.address, funds, description)
    transfer.signature = transfer.sign(walletA.privateKey)

    // Sender pays the fee to the network
    const txFee = new Transaction(walletA.address, this.#network.address, fee, 'Transaction Fee')
    txFee.signature = txFee.sign(walletA.privateKey)
    txFee.id = txFee.calculateHash()

    // Add new pending transactions in the blockchain representing the transfer and the fee
    this.#ledger.pendingTransactions.push(transfer, txFee)
    return transfer
  }

  writeLedger(filename) {
    const toArray = a => [...a]
    const jsonString = a => JSON.stringify(a.toJSON())
    const csv = arr => arr.map(jsonString).join(',')
    const buffer = str => Buffer.from(str, 'utf8')
    const write = buff => fs.writeFileSync(filename, buff)
    return write(buffer(csv(toArray(this.#ledger))))
  }
}
export default BitcoinService
