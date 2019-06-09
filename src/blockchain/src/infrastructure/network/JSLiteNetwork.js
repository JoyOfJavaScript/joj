import { MAX_NODES, SYNC_TIMER } from '../../common/settings'
import BitcoinService from '../../domain/service/BitcoinService'
import Blockchain from '../../domain/Blockchain'
import EventEmitter from 'events'
import Key from '../../domain/value/Key'
import Node from './Node'
import Wallet from '../../domain/Wallet'

export default class JSLiteNetwork {
  #nodes
  #intervalId
  #emitter
  #pendingTransactions
  #networkWallet
  #service

  constructor() {
    this.#nodes = []
    this.#pendingTransactions = []
    this.#emitter = new EventEmitter().setMaxListeners(MAX_NODES)
    this.#networkWallet = new Wallet(Key('jsl-public.pem'), Key('jsl-private.pem'))
    this.#service = new BitcoinService(new Blockchain())
  }

  get address() {
    return this.#networkWallet.address
  }

  addMinerNode({ displayName, address }) {
    if (this.#nodes.length >= MAX_NODES) {
      throw 'Max Nodes Exceeded!'
    }
    const difficulty = JSLiteNetwork.calculateRandomDifficulty()
    const minerFn = this.#service.minePendingTransactions.bind(this.#service, address, difficulty)
    const minerNode = new Node(displayName, address, difficulty, this.#emitter, minerFn)
    this.#nodes.push(minerNode)
    return minerNode
  }

  processTransaction(transactionDetails) {
    // take the transaction and use transfer funds to put it in the shared ledger
    this.#service.transferFunds(...transactionDetails)

    // miners get the a copy of ledger from the network and start proof of work with certain difficulty
    // when proof of work finishes, first miner to accomplish sends event to other miner
  }

  static calculateRandomDifficulty() {
    return getRandomInteger(1, 4)
  }

  start() {
    this.#intervalId = setInterval(() => {
      this.#emitter.emit('MINE_BLOCK')
    }, SYNC_TIMER)
  }

  stop() {
    this.#emitter.removeAllListeners()
    clearInterval(this.#intervalId)
  }
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
