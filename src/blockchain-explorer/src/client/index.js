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

const client = new WebSocketClient()

client.on('connect', function (connection) {
  console.log('Client Connected')

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'")
    }
  })

  connection.on('error', function (error) {
    console.log('Connection Error: ' + error.toString())
  })
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed')
  })

  function sendNumber () {
    if (connection.connected) {
      var number = Math.round(Math.random() * 0xffffff)
      connection.sendUTF(number.toString())
    }
  }
  sendNumber()
})

client.connect('ws://localhost:1337')

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
