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
import readline from 'readline'
import { cursorUp, cursorDown } from './ansi'
import { isUpKey, isDownKey, isKillSequence } from './keyboard'

const client = new WebSocketClient()

client.on('connect', function (connection) {
  console.log('Client Connected')

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'")
      const messageObj = JSON.parse(message.utf8Data)
      if (messageObj.payload.actions) {
        const actions = messageObj.payload.actions
        console.log('List of actions:')
        setUpCliInterface(actions)
      }
    }
  })

  connection.on('error', function (error) {
    console.log('Connection Error: ' + error.toString())
  })
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed')
  })

  listActions(connection)
})

client.connect('ws://localhost:1337')

function listActions (connection) {
  connection.sendUTF(JSON.stringify({ actions: '*' }))
}

function setUpCliInterface (actions) {
  const rl = readline.createInterface({
    terminal: true,
    input: process.stdin,
    output: process.stdout
  })

  rl.question(menu`Pick your actions ${actions}`, answer => {
    console.log(`Your selection is: ${answer}`)

    rl.close()
  })
  rl.output.write(cursorUp(actions.length))

  readline.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) {
    // Support scroll up and down using the keyboard
    process.stdin.setRawMode(true)
    rl.input.on('keypress', (value, key) => {
      if (isKillSequence(key)) {
        process.exit()
      } else {
        if (isUpKey(key)) {
          rl.output.write(cursorUp(1))
        } else if (isDownKey(key)) {
          rl.output.write(cursorDown(1))
        }
      }
    })
  } else {
    // Handle numerical values
  }
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

function menu (header, actionsExp) {
  // We can even return a string built using a template literal
  return `${header[0].trim()}:\n${actionsExp.map(a => `-> ${a}\n`).join('')}`
}

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
