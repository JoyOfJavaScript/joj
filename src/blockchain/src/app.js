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

// Initialize infrastructure
const network = new JSLiteNetwork()

const publicLedger1 = new Blockchain()
const publicLedger2 = new Blockchain()

const jsliteService1 = new BitcoinService(publicLedger1)
const jsliteService2 = new BitcoinService(publicLedger2)

const node1Config = {
  displayName: 'Miner 1',
  address: miner.address,
  minerFn: jsliteService1.minePendingTransactions.bind(jsliteService1)
}

const node2Config = {
  displayName: 'Miner 2',
  address: miner2.address,
  minerFn: jsliteService2.minePendingTransactions.bind(jsliteService2)
}

network.addMinerNode(node1Config)
network.addMinerNode(node2Config)

async function runSimulation() {
  await loadChain(jsliteService1, publicLedger1, miner, (100).jsl())
  await loadChain(jsliteService2, publicLedger2, miner2, (200).jsl())

  network.start()

  const simulation = setInterval(() => {
    const transferIndex = Util.nextInteger().next().value % dummyTransfers.size
    const dummyTransfer = dummyTransfers.get(transferIndex)
    try {
      jsliteService1.transferFunds(...dummyTransfer)
    } catch (e) {
      // continue simulation
    }
  }, 5_000)

  setTimeout(() => {
    clearInterval(simulation)
    network.stop()
    console.log('simulation ended')
    printChain('Miner 1 Ledger', publicLedger1)
    printChain('Miner 2 ledger', publicLedger2)
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
  console.log("Miner 2's balance is", miner2.balance(chain).toString())
}

// Put some money in the network to start simulation
async function loadChain(service, chain, minerWallet, funds) {
  const first = new Transaction(null, minerWallet.address, funds, 'First transaction in chain')
  first.signature = first.sign(minerWallet.privateKey)
  publicLedger1.addPendingTransaction(first)

  // Mine the first block, after mining the reward of 100 JSL will go toward the miner
  const minedBlock = await service.minePendingTransactions(minerWallet.address, 2)
  console.log(`Mined ${minedBlock.transactions.length} new transactions into the chain`)
  console.log('Miner starts out with %s', minerWallet.balance(chain).toString())
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
