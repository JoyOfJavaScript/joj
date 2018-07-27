import App from './component/App'
import ChangeProxy from './component/ChangeProxy'
import { SVG } from './api'
import * as Actions from '../shared/actions'
import { Combinators } from '@joj/adt'
import { listen$, throttle$, filter$ } from '../shared/observable/operators'

const { compose } = Combinators

const WebSocket = window.WebSocket || window.MozWebSocket
const client = new WebSocket('ws://127.0.0.1:1337')

const fetchRootElementName = id =>
  Array.from(document.getElementsByTagName('script')) // was: [].slice.call() or [...nodelist]
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const root = fetchRootElementName('data-root-id')

//// Add in chapter, modular library design. Ex the design of Ramda, Rx etc

// Instantiate blockchain
const state = ChangeProxy([], newState => {
  console.log('new state', newState)
  SVG.Document.render(App(newState).render(), document.getElementById(root))
})

const throttledClickListener$ = compose(
  filter$(event => event.button === 0),
  throttle$(2000),
  listen$('click')
)

client.onopen = function() {
  if (client.readyState === client.OPEN) {
    console.log('WebSocket Client Connected and ready')
    // Create new Blockchain
    client.send(
      JSON.stringify({
        action: Actions.NEW,
      })
    )
  }
}

const validateBlockchain$ = throttledClickListener$(
  document.getElementById('validate-blockchain-button')
).subscribe({
  next(val) {
    client.send(
      JSON.stringify({
        action: Actions.VALIDATE_BC,
      })
    )
  },
  error(err) {
    console.log('Received an error: ' + err)
  },
  complete() {
    console.log('Stream complete')
  },
})

client.onerror = function(event) {
  // an error occurred when sending/receiving data
  if (event.type === 'error') {
    console.log('Error recieved', event)
  }
  // After calling this function, no more events will be sent
  validateBlockchain$.unsubscribe()
}

client.onclose = () => {
  // After calling this function, no more events will be sent
  validateBlockchain$.unsubscribe()
}

client.onmessage = function(message) {
  // try to decode json (I assume that each message
  // from server is json)
  try {
    processResponse(message)
  } catch (e) {
    console.log(e)
    return
  }
  // handle incoming message
}

function processResponse(message) {
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
