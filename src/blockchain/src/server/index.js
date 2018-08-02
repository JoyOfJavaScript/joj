import * as Actions from './actions'
import * as Codes from './codes'
import BlockchainService from '../service/BlockChainService'
import WebSocket from 'websocket'
import http from 'http'

process.title = 'blockchain'

const { server: WebSocketServer } = WebSocket

const server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  console.log(new Date() + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})

server.listen(1337, function () {})

// create the server
const wsServer = new WebSocketServer({
  httpServer: server
})

// WebSocket server
wsServer.on('request', request => {
  const connection = request.accept(null, request.origin)
  console.log('Connection opened with server!')
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', message => {
    if (message.type === 'utf8') {
      processRequest(connection, JSON.parse(message.utf8Data))
      // process WebSocket message
      // console.log('Connection opened with server!', action)
    }
  })

  connection.on('close', connection => {
    // close user connection
    console.log('Connection closed!')
  })
})

// Move this into a global store
let chain = null

function processRequest (connection, req) {
  console.log(`Action received ${req.action}`)
  switch (req.action) {
    case Actions.NEW:
      console.log('Creating a new blockchain...')
      chain = BlockchainService.newBlockchain()
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          payload: { actions: [Actions.MINE_BLOCK, Actions.VALIDATE_BC] }
        })
      )
      break
    case Actions.MINE_BLOCK:
      console.log('Mining new block')
      BlockchainService.break
    case Actions.VALIDATE_BC:
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          action: Actions.VALIDATE_BC,
          payload: {
            result: !!BlockchainService.isChainValid(chain)
          }
        })
      )
      break
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
