import './domain/value/Money'
import BitcoinService from './domain/service/BitcoinService'
import Blockchain from './domain/Blockchain'
import JSLiteNetwork from './infrastructure/network/JSLiteNetwork'
import Key from './domain/value/Key'
import Transaction from './domain/Transaction'
import Wallet from './domain/Wallet'

// Users in simulation
const luke = new Wallet(Key('luke-public.pem'), Key('luke-private.pem'))
const ana = new Wallet(Key('ana-public.pem'), Key('ana-private.pem'))
const miner = new Wallet(Key('miner-public.pem'), Key('miner-private.pem'))
const miner2 = new Wallet(Key('coinbase-public.pem'), Key('coinbase-private.pem'))

// Transfers made during simulation
const dummyTransfers = new Map([
  [0, [miner, luke, (10).jsl(), 'Transfer 10 JSL to Luke']],
  [1, [luke, ana, (5).jsl(), 'Transfer 5 JSL from Luke to Ana']],
  [2, [ana, luke, (2.5).jsl(), 'Transfer 2.5 JSL from Ana to Luke']],
  [3, [miner, ana, (10).jsl(), 'Transfer 10 JSL to Ana']],
  [4, [miner, miner2, (30).jsl(), 'Transfer 30 JSL to Second Miner']]
])

// // Initialize infrastructure
const publicLedger = new Blockchain()
const jsliteService = new BitcoinService(publicLedger)
const network = new JSLiteNetwork()
const minerFunction = jsliteService.minePendingTransactions.bind(jsliteService)
network.addMinerNode('Miner 1', miner.address, minerFunction)
network.addMinerNode('Miner 2', miner2.address, minerFunction)

async function runSimulation() {
  // Put some money in the network to start simulation
  const first = new Transaction(null, miner.address, (100).jsl(), 'First transaction')
  first.signature = first.sign(miner.privateKey)
  publicLedger.addPendingTransaction(first)

  // Mine the first block, after mining the reward of 100 JSL will go toward the miner
  const minedBlock = await jsliteService.minePendingTransactions(miner.address, 2)
  console.log(`Mined ${minedBlock.transactions.length} new transactions into the chain`)
  console.log('Miner starts out with %s', miner.balance(publicLedger).toString())

  network.start()

  const simulation = setInterval(() => {
    const transferIndex = Util.nextInteger().next().value % dummyTransfers.size
    const dummyTransfer = dummyTransfers.get(transferIndex)
    try {
      jsliteService.transferFunds(...dummyTransfer)
    } catch (e) {
      // continue simulation
    }
  }, 5_000)

  setTimeout(() => {
    clearInterval(simulation)
    network.stop()
    console.log('simulation ended')
    console.table(
      [...publicLedger].map(block => ({
        previousHash: block.previousHash.valueOf(),
        hash: block.hash.valueOf(),
        ['tx-count']: block.transactions.length
      }))
    )
    console.log("Luke's balance is", luke.balance(publicLedger).toString())
    console.log("Ana's balance is", ana.balance(publicLedger).toString())
    console.log("Miner's balance is", miner.balance(publicLedger).toString())
    console.log("Miner 2's balance is", miner2.balance(publicLedger).toString())
  }, 120_000)

  return 0
}

const Util = {
  nextInteger: function* next() {
    yield Util.getRandomInteger(1, Number.MAX_SAFE_INTEGER)
  },
  getRandomInteger: function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
}

runSimulation().then(() => console.log('simulation started'))
