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

// Transfers made during simulation
const simulatedTransfers = new Map([
  [0, [miner.address, luke.address, (10).jsl(), 'Transfer 10 JSL to Luke']],
  [1, [luke.address, ana.address, (5).jsl(), 'Transfer 5 JSL from Luke to Ana']],
  [3, [ana.address, luke.address, (2.5).jsl(), 'Transfer 2.5 JSL from Ana to Luke']]
])

// // Initialize infrastructure
// const publicLedger = new Blockchain()
// const jsliteService = new BitcoinService(publicLedger)
// const network = new JSLiteNetwork()
// network.addMinerNode(miner.address, jsliteService.minePendingTransactions.bind(jsliteService))

async function runSimulation() {
  // Put some money in the network to start simulation
  const first = new Transaction(null, miner.address, (100).jsl(), 'First transaction')
  first.signature = first.sign(miner.privateKey)
  publicLedger.addPendingTransaction(first)

  // Mine the first block, after mining the reward of 100 JSL will go toward the miner
  const minedBlock = await jsliteService.minePendingTransactions(miner.address)
  console.log(`Mined ${minedBlock.pendingTransactions.length} new transactions into the chain`)
  console.log('Miner starts out with %d JSL', miner.balance(publicLedger))

  // Load a miner with some start-up money
  jsliteService.transferFunds(null, miner.address, (50).jsl(), 'Initial funds')

  return 0
}

// runSimulation().then(() => console.log('simulation ended'))
