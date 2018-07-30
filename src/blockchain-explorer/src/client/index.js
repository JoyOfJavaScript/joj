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

const client = new WebSocketClient()

client.on('connect', connection => {
  console.log('Client Connected')

  connection.on('message', async message => {
    const { type, utf8Data } = message
    if (type === 'utf8') {
      console.log("Received: '" + utf8Data + "'")
      const action = await handleIncomingMessages(utf8Data)
      sendAction(connection, action)
    } else {
      console.error(`Unable to handle message type ${type}`)
    }
  })

  connection.on('error', function (error) {
    console.log('Connection Error: ' + error.toString())
  })
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed')
  })

  connection.sendUTF(JSON.stringify({ action: '*' }))
})

client.connect('ws://localhost:1337')

async function handleIncomingMessages (data) {
  const messageObj = JSON.parse(data)
  if (messageObj.payload.actions) {
    return handleActionListing(messageObj.payload.actions)
  }
}

async function handleActionListing (actions) {
  console.log('List of actions:')
  const menu = new Menu(actions)
  return menu.display().then(selection => {
    console.log(`Your selection is ${selection}`)
    return selection
  })
}

function listActions (connection) {}

function sendAction (connection, action) {
  console.log(`Sending action ${action}`)
  connection.sendUTF(JSON.stringify({ action }))
}

// client.onerror = function (event) {
//   // an error occurred when sending/receiving data
//   if (event.type === 'error') {
//     console.log('Error recieved', event)
//   }
//   // After calling this function, no more events will be sent
//   validateBlockchain$.unsubscribe()
// }

// client.onclose = () => {
//   // After calling this function, no more events will be sent
//   validateBlockchain$.unsubscribe()
// }

// client.onmessage = function (message) {
//   // try to decode json (I assume that each message
//   // from server is json)
//   try {
//     processResponse(message)
//   } catch (e) {
//     console.log(e)
//   }
//   // handle incoming message
// }

function processResponse (message) {
  console.log(message)
  const { status, action, payload } = JSON.parse(message.data)
  if (status === 'Success') {
    switch (action) {
      case Actions.ADD_GENESIS:
        state.push({ name: 'Genesis' })
        break
      case Actions.VALIDATE_BC:
        if (payload.result) {
          alert('Chain is valid!')
        } else {
          alert('Chain is NOT valid!')
        }
        break
      default:
        alert('Unknown action')
    }
  } else {
    alert(`Error ocurred: ${payload.message}`)
  }
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
