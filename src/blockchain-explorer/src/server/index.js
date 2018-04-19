import WebSocket from 'websocket'
import http from 'http'

const { server: WebSocketServer } = WebSocket

const server = http.createServer((request, response) => {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
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
      // process WebSocket message
    }
  })

  connection.on('close', connection => {
    // close user connection
    console.log('Connection closed!')
  })
})
