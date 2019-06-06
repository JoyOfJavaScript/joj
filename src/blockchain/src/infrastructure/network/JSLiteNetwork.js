import { MAX_NODES, SYNC_TIMER } from '../../common/settings'
import EventEmitter from 'events'
import Key from '../../domain/value/Key'
import Wallet from '../../domain/Wallet'

export default class JSLiteNetwork {
  #nodes
  #intervalId
  #emitter
  #pendingTransactions
  #networkWallet

  constructor() {
    this.#nodes = new Array(MAX_NODES)
    this.#emitter = new EventEmitter()
    this.#pendingTransactions = []
    this.#networkWallet = new Wallet(Key('jsl-public.pem'), Key('jsl-private.pem'))
    this.startInterval()
  }

  get address() {
    return this.#networkWallet.address
  }

  async addMinerNode(minerAddress, mineBlockFn) {
    if (this.#nodes.length >= MAX_NODES) {
      throw 'Max Nodes Exceeded!'
    }
    const difficulty = JSLiteNetwork.calculateRandomDifficulty()
    const minerNode = new Node(minerAddress, difficulty, this.#emitter, mineBlockFn)
    this.#nodes.push(minerNode)
    return minerNode
  }

  static calculateRandomDifficulty() {
    return 2
  }

  startInterval() {
    this.#intervalId = setInterval(() => {
      this.#emitter.emit('MINE_BLOCK')
    }, SYNC_TIMER)
  }

  shutdown() {
    clearInterval(this.#intervalId)
  }
}

/**
 * Mining nodes
 */
class Node {
  address
  difficulty
  constructor(address, difficulty, emmitter, mineBlockFn) {
    this.address = address
    this.difficulty = difficulty
    this.emmitter = emmitter
    this.proofOfWorkFn = mineBlockFn
    this.initEvent(mineBlockFn)
  }

  initEvent(mineBlockFn) {
    this.emmitter.on('MINE_BLOCK', () => {
      mineBlockFn(this.address)
    })
  }
}
