import App from './component/App'
import ChangeProxy from './component/ChangeProxy'
import { SVG } from './api'
import * as Actions from '../shared/actions'

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

const WebSocket = window.WebSocket || window.MozWebSocket
const client = new WebSocket('ws://127.0.0.1:1337')
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

client.onerror = function(event) {
  // an error occurred when sending/receiving data
  console.log(event)
  if (event.type === 'error') {
    console.log('Error recieved')
  }
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
  const { status, action } = JSON.parse(message.data)
  if (status === 'Success') {
    switch (action) {
      case Actions.ADD_GENESIS:
        state.push({ name: 'Genesis' })
        break
      default:
        alert('Unknown action')
    }
  } else {
    alert(`Error ocurred: ${message}`)
  }
}
