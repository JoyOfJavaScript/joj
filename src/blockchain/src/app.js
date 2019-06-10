import './domain/value/Money'
import BitcoinService from './domain/service/BitcoinService'
import Key from './domain/value/Key'
import Network from './infrastructure/network/Network'
import Transaction from './domain/Transaction'
import Wallet from './domain/Wallet'

// Users in simulation
const luke = new Wallet(Key('luke-public.pem'), Key('luke-private.pem'))
const ana = new Wallet(Key('ana-public.pem'), Key('ana-private.pem'))
const miner = new Wallet(Key('miner-public.pem'), Key('miner-private.pem'))
const miner2 = new Wallet(Key('coinbase-public.pem'), Key('coinbase-private.pem'))

// Transfers made during simulation
const dummyTransfers = new Map([
  [1, [luke, ana, (5).jsl(), 'Transfer 5 JSL from Luke to Ana']]
  // [2, [ana, luke, (2.5).jsl(), 'Transfer 2.5 JSL from Ana to Luke']],
  // [3, [ana, luke, (10).jsl(), 'Transfer 10 JSL from Ana to Luke']]
])

// Initialize infrastructure
const network = new Network()

// Initialize two miners in the network
const node1Config = {
  displayName: 'Miner 1',
  address: miner.address
}

const node2Config = {
  displayName: 'Miner 2',
  address: miner2.address
}

network.addMinerNode(node1Config)
//network.addMinerNode(node2Config)

// Run simluation
async function runSimulation() {
  // Give Luke and Ana a total of 10 JSL to each so that they can transact
  await network.loadFunds(luke, (10).jsl())
  await network.loadFunds(ana, (10).jsl())

  // Start network
  network.start()

  const simulation = setInterval(() => {
    const transferIndex = Util.nextInteger().next().value % dummyTransfers.size
    const dummyTransfer = dummyTransfers.get(transferIndex)
    // network.processTransaction(dummyTransfer)
  }, 5_000)

  setTimeout(() => {
    clearInterval(simulation)
    network.stop()
    console.log('simulation ended')
    printChain('Miner 1 Ledger', network.chain)
  }, 10_000)

  return 0
}

function printChain(reportName, chain) {
  console.log(`Summary for ${reportName}`)
  console.table(
    [...chain].map(block => ({
      previousHash: block.previousHash.valueOf(),
      hash: block.hash.valueOf(),
      ['tx-count']: block.transactions.length
    }))
  )
  console.log("Luke's balance is", luke.balance(chain).toString())
  console.log("Ana's balance is", ana.balance(chain).toString())
  console.log("Miner's balance is", miner.balance(chain).toString())
  console.log("Miner 2's balance is", miner2.balance(chain).toString())
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
