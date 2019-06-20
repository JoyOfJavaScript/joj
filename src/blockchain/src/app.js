import './domain/value/Money'
import Key from './domain/value/Key'
import Network from './infrastructure/network/Network'
import Wallet from './domain/Wallet'

// Users in simulation
const luke = new Wallet(Key('luke-public.pem'), Key('luke-private.pem'))
const ana = new Wallet(Key('ana-public.pem'), Key('ana-private.pem'))
const miner = new Wallet(Key('miner-public.pem'), Key('miner-private.pem'))

// Transfers made during simulation
const dummyTransfers = new Map([
  [1, [luke, ana, (5).jsl(), 'Transfer 5 JSL from Luke to Ana']],
  [2, [ana, luke, (2.5).jsl(), 'Transfer 2.5 JSL from Ana to Luke']],
  [3, [ana, luke, (10).jsl(), 'Transfer 10 JSL from Ana to Luke']],
  [4, [miner, luke, (20).jsl(), 'Transfer 20 JSL Luke']]
])

// Initialize infrastructure
const network = new Network()

network.addMinerNode('Miner', miner.address)

// Run simluation
async function runSimulation() {
  // Start network
  network.start()

  const simulation = setInterval(() => {
    const nextTransfer = Util.nextInteger().next().value % dummyTransfers.size
    const dummyTransfer = dummyTransfers.get(nextTransfer)
    network.processTransaction(dummyTransfer)
  }, 5_000)

  setTimeout(() => {
    clearInterval(simulation)
    network.stop()
    console.log('simulation ended')
    printChain('Ledger Summary', network.chain)
  }, 120_000)

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
