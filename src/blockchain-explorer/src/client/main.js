import App from './component/App'
import BlockchainService from '@joj/blockchain/BlockchainService'
import { SVG } from './api'

const fetchRootElementName = id =>
  Array.from(document.getElementsByTagName('script')) // was: [].slice.call() or [...nodelist]
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const root = fetchRootElementName('data-root-id')

//// Add in chapter, modular library design. Ex the design of Ramda, Rx etc

// Instantiate blockchain

const state = {
  data: [],
}
const app = App(state).render()
app.state = { mydata: 'luis' }
SVG.Document.render(app, document.getElementById(root))

const WebSocket = window.WebSocket || window.MozWebSocket
const connection = new WebSocket('ws://127.0.0.1:1337')
connection.onopen = function() {
  // connection is opened and ready to use
}

connection.onerror = function(error) {
  // an error occurred when sending/receiving data
}

connection.onmessage = function(message) {
  // try to decode json (I assume that each message
  // from server is json)
  try {
    const json = JSON.parse(message.data)
  } catch (e) {
    console.log("This doesn't look like a valid JSON: ", message.data)
    return
  }
  // handle incoming message
}
