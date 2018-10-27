import '../rx/reactive-extensions'
import {
  client as WebSocketClient,
  connection as WebSocketConnection
} from 'websocket'
import * as Actions from './actions'
import Peer from './Peer'
import wellKnownPeers from './well_known_peers'
import { resolveSoa } from 'dns'

const PeerClient = Object.create(Peer)

PeerClient.init = function (port) {
  Peer.init.call(this, port)
  this.client = new WebSocketClient() // Can't promisify this API nor the socket.io API since they follow non-standard callbacks
  // PeerClient.registerHandlers()
  return this
}

/**
 * Periodically discover peers that get added
 */
PeerClient.discoverPeers = async function () {
  setInterval(async () => {
    this.resetPeers()
    const discoverAsync = (peer, factor) => {
      console.log('Trying to reach ' + peer)
      return new Promise(resolve => {
        setTimeout(() => {
          this.client.on('connect', connection => {
            connection.on('error', error => {
              console.log(error.message)
              resolve(false)
            })
            connection.on('close', function () {
              console.log('Detected a connection close')
              resolve(false)
            })
            if (connection.connected) {
              resolve(peer)
            }
          })
          this.client.on('connectFailed', function (error) {
            console.log('connect failed', error.message)
            resolve(false)
          })
          this.client.connect(`ws://localhost:${peer}`)
        }, factor * 2 * 1000)
      })
    }
    try {
      for await (const discoveredPeer of wellKnownPeers
        .filter(p => p !== this.id)
        .map((peer, index) => discoverAsync(peer, index))) {
          if (discoveredPeer) {
            console.log('Discovered new peer : ' + discoveredPeer)
            this.addPeer(discoveredPeer)
            console.log('Has ' + this.countPeers() + ' peers')
          }
        }
    } catch (e) {
      console.log(e.message)
    }
  }, 10 * 1000)
}

PeerClient.handleIncomingMessages = async function (messages) {
  const messageObj = JSON.parse(messages)
  console.log(messageObj)
}

PeerClient.handle = function () {}

// PeerClient.registerHandlers = function () {
//   this.client.on('connect', connection => {
//     if (connection.connected) {
//       console.log(connection)
//       this.addPeer(3001)
//     }

//     // streamify(connection)
//     //   .filter(({ type }) => type === 'utf8')
//     //   .map(({ utf8Data }) => utf8Data)
//     //   .subscribe({
//     //     next: async message => await this.handleIncomingMessages(message),
//     //     error: error => {
//     //       console.log(error.message)
//     //     },
//     //     complete: () => {
//     //       console.log('Connection terminated by server!')
//     //     }
//     //   })
//   })
// }

const streamify = connection =>
  new Observable(observer => {
    // Handle incoming messages
    connection.on('message', message => observer.next(message))

    // Handler errors cases
    const errorHandler = error => observer.error(new Error(error))
    connection.on('error', errorHandler)
    connection.on('connectFailed', errorHandler)

    // Handle when the server stops sending data
    connection.on('close', () => observer.complete())

    return () => {
      // Gracefully close the connection
      connection.close(WebSocketConnection.CLOSE_REASON_NORMAL)
    }
  })

export default PeerClient
