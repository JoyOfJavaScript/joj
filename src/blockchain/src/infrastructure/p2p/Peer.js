/**
 * Each peer is both a ws server and a ws client
 */

import BitcoinService from '../service/BitcoinService'
import Blockchain from '../domain/Blockchain'

const Peer = {
  init (id) {
    this.id = Number(id)
    this.bitcoinService = new BitcoinService(Blockchain())
    this.peers = []
    this.pendingTransactions = []
    return this
  },
  addPendingTransaction (tx) {
    this.pendingTransactions.push(tx)
    return this
  },
  addPeer (peer) {
    console.log(`Adding new peer ${peer}`)
    this.peers.push(peer)
    return this
  },
  countPeers () {
    return this.peers.length
  },
  resetPeers () {
    this.peers = []
  },
  removePeer (peer) {
    console.log(`Removing peer ${peer}`)
    this.peers = this.peers.filter(p => p !== peer)
    return this
  }
}

export default Peer
