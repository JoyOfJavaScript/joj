import * as Actions from './actions'
import * as Codes from './codes'
import BlockchainService from '../service/BlockChainService'
import Key from '../data/Key'
import Money from '../data/Money'
import Transaction from '../data/Transaction'
import Wallet from '../data/Wallet'
import WebSocket from 'websocket'
import http from 'http'
import sync from './sync'

process.title = 'blockchain-server'

const { server: WebSocketServer } = WebSocket

const httpServer = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  console.log(new Date() + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})

httpServer.listen(1337, function () {})

// create the server
const wsServer = new WebSocketServer({ httpServer })

// WebSocket server
wsServer.on('request', request => {
  const connection = request.accept(null, request.origin)
  console.log('Connection opened with server!')
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', async message => {
    if (message.type === 'utf8') {
      processRequest(connection, JSON.parse(message.utf8Data))
      // process WebSocket message
      // console.log('Connection opened with server!', action)
    }
  })

  connection.on('close', connection => {
    // close user connection
    console.log('Connection closed by client!')
  })
})

// Collect all transactions in blockchain and mine them into a new block
function nextTick (blockchain) {
  console.log(`Begin: Blockchain has ${blockchain.height()} blocks`)

  console.log(`End: Blockchain has ${blockchain.height()} blocks`)
}

async function processRequest (connection, req) {
  switch (req.action) {
    case Actions.NEW: {
      console.log('Creating a new blockchain with its genesis block...')
      // Create new chain
      const chain = await BlockchainService.newBlockchain()
      // Start the sync loop
      sync(chain).subscribe(nextTick)
      // Send respond
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          payload: { actions: [Actions.MINE_BLOCK, Actions.VALIDATE_BC] }
        })
      )
      break
    }
    case Actions.NEW_TRANSACTION: {
      console.log('Creating a new transaction')
      const from = Wallet(
        Key(`${req.from}-public.pem`),
        Key(`${req.from}-private.pem`)
      )
      const to = Wallet(
        Key(`${req.to}-public.pem`),
        Key(`${req.to}-private.pem`)
      )
      const tx = Transaction(from.address, to.address, Money('₿', req.amount))
      first.signature = first.generateSignature(miner.privateKey)
      chain.pendingTransactions = [first]

      // Mine some initial block, after mining the reward is BTC 100 for wa
      const block = await BlockchainService.minePendingTransactions(
        chain,
        miner.address
      )
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          payload: {
            block: block.hash,
            actions: [Actions.VALIDATE_BC]
          }
        })
      )
      break
    }
    case Actions.VALIDATE_BC: {
      console.log(`Validating blockchain with ${chain.length()} blocks`)
      const isValid = await BlockchainService.isChainValid(chain)
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          payload: {
            result: !!isValid,
            actions: [Actions.MINE_BLOCK, Actions.VALIDATE_BC]
          }
        })
      )
      break
    }
    default: {
      const msg = `Unspecified action ${req.action}`
      console.log(msg)
      connection.sendUTF(
        JSON.stringify({
          status: Codes.SUCCESS,
          action: req.action,
          payload: { actions: Object.keys(Actions) }
        })
      )
    }
  }
}
console.log('Websocket server listening...')
