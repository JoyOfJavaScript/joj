// const express = require("express")
// const bodyParser = require('body-parser')
// const WebSocket = require("ws")

// const http_port = process.env.HTTP_PORT || 3001
// const p2p_port = process.env.P2P_PORT || 6001
// const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []
// const peers = []
// let wss

// const initHttpServer = () => {

//     const app = express()
//     app.use(bodyParser.json())

//     app.get('/ping', (req, res) => {
//         const ping = "I'm alive"
//         console.log(ping)
//         broadcast(ping)
//         res.send(ping)
//     });

//     app.listen(http_port, () => console.log('Listening http on port: ' + http_port))
// };


// const initP2PServer = () => {

//     wss = new WebSocket.Server({ port: p2p_port })
//     wss.on('connection', (ws) => {
//         // do something and broadcast incoming message
//         ws.on('message', (data) => {
//             console.log(data)
//             broadcast(JSON.parse(data))
//         });
//     });

//     console.log('listening websocket p2p port on: ' + p2p_port)

// };

// const initPeers = (initialPeers) => {
//     initialPeers.forEach((peer) => {
//         const ws = new WebSocket(peer)
//         peers.push(ws)
//     })
// };

// var broadcast = (data) => {
//     peers.forEach(ws => {
//         ws.send(JSON.stringify(data))
//     });
// }

// initHttpServer();
// initP2PServer();
// initPeers(initialPeers)