/**
 * Client app exposes a CLI interface to manage the blockchain. This includes
 * operations such as initializing a blockchain, mining new blocks, creating transactions,
 * printing the blockchain, and rendering to SVG
 *
 * Usage:
 * ...
 * ...
 */
import { client as WebSocketClient } from 'websocket'
import Menu from './Menu'

process.title = 'blockchain-explorer'
const { log, error } = console

const client = new WebSocketClient() // Can't promisify this API nor the socket.io API since they follow non-standard callbacks

client.on('connect', connection => {
  log('Client Connected')

  // Handles messages from server
  handleNewMessage(connection)

  // Handles connection errors
  handleConnectionError(connection)

  // Handles connection closed from server
  handleConnectionClosed(connection)

  // Initiates conversation
  connection.sendUTF(JSON.stringify({ action: '*' }))
})

client.connect('ws://localhost:1337')

client.on('connectFailed', err => {
  log(`Client was not able to connect. ${err}`)
})

async function handleIncomingMessages (data) {
  const messageObj = JSON.parse(data)
  if (messageObj.payload.actions) {
    return handleActionListing(messageObj.payload.actions)
  }
}

async function handleActionListing (actions) {
  return Menu.show(actions).ask().then(selection => {
    log(`Your selection is ${selection}`)
    return selection
  })
}

function sendAction (connection, action) {
  log(`Sending action ${action}`)
  connection.sendUTF(JSON.stringify({ action }))
}

function handleConnectionClosed (connection) {
  connection.on('close', function () {
    log('echo-protocol Connection Closed')
  })
}

function handleConnectionError (connection) {
  connection.on('error', function (error) {
    log('Connection Error: ' + error.toString())
  })
}

function handleNewMessage (connection) {
  connection.on('message', async message => {
    const { type, utf8Data } = message
    if (type === 'utf8') {
      log('Server response: ', utf8Data)
      sendAction(connection, await handleIncomingMessages(utf8Data))
    } else {
      error(`Unable to handle message type ${type}`)
    }
  })
}

/*
function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
*/
