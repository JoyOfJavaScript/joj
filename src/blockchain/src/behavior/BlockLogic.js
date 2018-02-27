import crypto from 'crypto'
import Block from '../data/Block'
import TransactionalBlock from '../data/TransactionalBlock'
import { notEmpty, checkInvariant } from '../common/helpers'
import { curry, compose } from 'ramda'

const ALGO_SHA256 = 'sha256'
const ENCODING_UTF8 = 'hex'

/**
 * Create a new block
 */
const newBlock = (timestamp, data, previousHash = '') =>
  Object.create(Block).init(
    checkInvariant('timestamp', notEmpty, timestamp),
    data,
    previousHash
  )

const newTxBlock = (timestamp, transactions) =>
  TransactionalBlock(timestamp, transactions)

const mineBlock = (difficulty, block) =>
  compareHashUntil(
    block,
    Array(difficulty)
      .fill(0)
      .join('')
  )

const compareHashUntil = (block, difficulty, nonce = 1) => {
  if (block.hash.startsWith(difficulty)) {
    // Base case reached, return new hash
    console.log(`Block mined: ${block.hash}`)
    return block
  }
  // Continue to compute the hash again with higher nonce value
  block.nonce = nonce
  block.hash = calculateBlockHash(block)
  return compareHashUntil(block, difficulty, nonce + 1)
}

/**
 * Format the provided data pieces and joins them together
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 */
const formatData = (...pieces) => pieces.map(JSON.stringify).join('')

/**
 * Create a SHA256 digest from a given data string
 *
 * @param {String} algorithm Algorithm to use (e.g. sha256)
 * @param {String} data      Data to use as seed for the hash
 */
const createDigest = curry((algorithm, encoding, data) =>
  crypto
    .createHash(algorithm)
    .update(data)
    .digest(encoding)
)

/**
 * Calculates a hash from given block data pieces
 *
 * @param {Array} pieces Pieces of data to join together into a single string
 */
const calculateHash = compose(
  createDigest(ALGO_SHA256, ENCODING_UTF8),
  formatData
)

/**
 * Static version of calculate hash
 *
 * @param  {String} Block Block data to calculate hash from
 * @return {String} New hash
 */
const calculateBlockHash = ({ timestamp, data, previousHash, nonce }) =>
  calculateHash(timestamp, data, previousHash || '', nonce || 0)

/**
 * Exported BlockLogic interface
 */
const BlockLogic = {
  newBlock,
  newTxBlock,
  mineBlock,
  calculateBlockHash
}

export default BlockLogic
