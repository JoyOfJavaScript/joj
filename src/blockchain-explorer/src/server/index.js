import WebSocket from 'websocket'
import http from 'http'
import { BlockchainService } from '@joj/blockchain'
import * as Actions from '../shared/actions'

const { server: WebSocketServer } = WebSocket

const server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  console.log(new Date() + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})
server.listen(1337, function() {})

// create the server
const wsServer = new WebSocketServer({
  httpServer: server,
})

// WebSocket server
wsServer.on('request', request => {
  const connection = request.accept(null, request.origin)
  console.log('Connection opened with server!')
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', message => {
    if (message.type === 'utf8') {
      processRequest(JSON.parse(message.utf8Data), connection)
      // process WebSocket message
      //console.log('Connection opened with server!', action)
    }
  })

  connection.on('close', connection => {
    // close user connection
    console.log('Connection closed!')
  })
})

// Move this into a global store
let chain = null

function processRequest(req, connection) {
  switch (req.action) {
    case Actions.NEW:
      console.log('New Blockchain')
      chain = BlockchainService.newBlockchain()
      connection.sendUTF(
        JSON.stringify({
          status: 'Success',
          action: Actions.ADD_GENESIS,
          payload: {},
        })
      )
      break
    default:
      console.log(`Unrecognized action ${req.action}`)
  }
}
