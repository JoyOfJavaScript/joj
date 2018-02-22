import crypto from 'crypto'
import { curry, compose, memoizeWith } from 'ramda'
import Block from '../data/block'

const ALGO_SHA256 = 'sha256'
const ENCODING = 'utf8'
const EPOCH = Date.parse('01 Jan 1970 00:00:00 GMT')

const BlockLogic = () => ({
  /**
   * Creates a genesis block give an arbitraty data object
   *
   * @param {Object} data Data to store into the first block
   */
  createGenesisBlock: data => Block(0, EPOCH, data, '-1'),

  newBlock: (index, timestamp, data, previousHash) =>
    Block(index, timestamp, data, previousHash, BlockLogic.calculateHash),

  /**
   * Calculates a hash from given block data pieces
   *
   * @param {Array} pieces Pieces of data to join together into a single string
   */
  calculateHash: compose(
    createDigest(crypto, ALGO_SHA256, ENCODING),
    formatData
  ),
  /**
   * Format the provided data pieces and joins them together
   *
   * @param {Array} pieces Pieces of data to join together into a single string
   */
  formatData: (...pieces) => pieces.map(JSON.stringify).join(''),
  /**
   * Create a SHA256 digest from a given data string
   *
   * @param {String} algorithm Algorithm to use (e.g. sha256)
   * @param {String} data      Data to use as seed for the hash
   */
  createDigest: curry((crypto, algorithm, encoding, data) =>
    crypto
      .createHash(algorithm)
      .update(data, encoding)
      .digest()
  )
})

export default BlockLogic
