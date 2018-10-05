/**
 * Client app exposes a CLI interface to manage the blockchain. This includes
 * operations such as initializing a blockchain, mining new blocks, creating transactions,
 * printing the blockchain, and rendering to SVG
 *
 * Usage:
 * ...
 * ...
 */
import {
  client as WebSocketClient,
  connection as WebSocketConnection
} from 'websocket'
import './reactive-extensions'
import Menu from './menu'

process.title = 'blockchain-explorer'
const { log, error } = console

const client = new WebSocketClient() // Can't promisify this API nor the socket.io API since they follow non-standard callbacks

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

client.on('connect', connection => {
  log('Client Connected')

  streamify(connection)
    .filter(({ type }) => type === 'utf8')
    .map(({ utf8Data }) => utf8Data)
    .subscribe({
      next: async message =>
        sendAction(connection, await handleIncomingMessages(message)),
      error: error => {
        console.log(error.message)
        Menu.close()
      },
      complete: () => {
        console.log('Connection terminated by server!')
        Menu.close()
      }
    })

  // Initiates conversation
  connection.sendUTF(JSON.stringify({ action: 'START' }))
})

client.connect('ws://localhost:1337')

async function handleIncomingMessages (data) {
  const messageObj = JSON.parse(data)
  handleMessage(messageObj)
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

function handleMessage (messageObj) {
  if (messageObj.action === 'PRINT_LEDGER') {
    console.table(JSON.parse(messageObj.payload.result))
  }
}

function sendAction (connection, action) {
  log(`Sending action ${action}`)
  connection.sendUTF(JSON.stringify({ action }))
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
