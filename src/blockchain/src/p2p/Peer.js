import * as Actions from './actions'
import WebSocket from 'websocket'
import http from 'http'
import wellKnownPeers from './well_known_peers'

const port = process.argv[2]
const peers = [port]
const pendingTransactions = []
const blockchain = listen(createServer(port))

function createServer (port) {
  const { server: WebSocketServer } = WebSocket

  const httpServer = http.createServer((request, response) => {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
    console.log(new Date() + ' Received request for ' + request.url)
    response.end()
  })

  httpServer.listen(port, () => {
    console.log(`Peer listening on port ${port}`)
  })

  return new WebSocketServer({ httpServer })
}

function listen (server) {
  server.on('request', request => {
    const connection = request.accept(null, request.origin)
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
}

async function processRequest (connection, req) {
  switch (req.action) {
    case Actions.DISCOVER_PEERS: {
      // get a list of other peers
      console.log('Discovery new peers')

      //   connection.sendUTF(
      //     JSON.stringify({
      //       status: 'Success',
      //       payload: {
      //         tx: tx.calculateHash(),
      //         actions: [Actions.NEW_TRANSACTION, Actions.VALIDATE_BC]
      //       }
      //     })
      //   )
      break
    }
    case Actions.NEW_TRANSACTION: {
      // accumulat epending transaction
      console.log('Simulating new random transaction')

      //   connection.sendUTF(
      //     JSON.stringify({
      //       status: 'Success',
      //       payload: {
      //         tx: tx.calculateHash(),
      //         actions: [Actions.NEW_TRANSACTION, Actions.VALIDATE_BC]
      //       }
      //     })
      //   )
      break
    }
    case Actions.VALIDATE_BLOCKCHAIN: {
      console.log(`Validating blockchain with ${LEDGER.height()} blocks`)
      const isValid = await BitcoinService.isLedgerValid(LEDGER)
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          payload: {
            result: !!isValid,
            actions: [
              Actions.NEW_TRANSACTION,
              Actions.VALIDATE_BC,
              Actions.PRINT_LEDGER
            ]
          }
        })
      )
      break
    }
    case Actions.MINE: {
      // Automatically broadcast the new block and sync with other peers
      const summary = []
      for (const block of LEDGER) {
        summary.push({
          previousHash: block.previousHash.toString(),
          hash: block.hash.toString(),
          confirmedTransactions: block.countPendingTransactions()
        })
      }
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          action: req.action,
          payload: {
            result: JSON.stringify(summary),
            actions: [
              Actions.NEW_TRANSACTION,
              Actions.VALIDATE_BC,
              Actions.STOP
            ]
          }
        })
      )
      break
    }
    default: {
      const msg = `Unspecified action ${req.action}`
      console.log(msg)
      // Stop main loop
      mainLoop.unsubscribe()

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
