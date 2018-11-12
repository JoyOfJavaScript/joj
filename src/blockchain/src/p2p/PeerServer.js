import * as Actions from './actions'
import Peer from './Peer'
import WebSocket from 'websocket'
import http from 'http'

const PeerServer = Object.create(Peer)

PeerServer.init = function (port) {
  Peer.init.call(this, port)
  this.port = port
  this.server = undefined // has not started listening
  return this
}

PeerServer.isListening = function () {
  return this.server !== undefined
}

PeerServer.listen = function () {
  const httpServer = http.createServer((request, response) => {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
    console.log(new Date() + ' Received request for ' + request.url)
    response.writeHead(404)
    response.end()
  })

  httpServer.listen(this.port, () => {
    console.log(new Date() + `Server is listening on port ${this.port}`)
  })
  const { server: WebSocketServer } = WebSocket
  const server = new WebSocketServer({
    httpServer
  })

  server.on('request', request => {
    const connection = request.accept(null, request.origin)
    console.log(new Date() + ' Connection accepted.')

    //    console.log('Incoming request', request)
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', async message => {
      console.log('received message')
      if (message.type === 'utf8') {
        processRequest(connection, JSON.parse(message.utf8Data))
        // process WebSocket message
        // console.log('Connection opened with server!', action)
      }
    })

    connection.on('close', () => {
      // close user connection
      console.log(
        new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
      )
    })
  })
  this.server = server
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
      const isValid = await LEDGER.validate()
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

export default PeerServer
