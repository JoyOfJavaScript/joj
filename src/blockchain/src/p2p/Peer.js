/**
 * Each peer is both a ws server and a ws client
 */

import BitcoinService from '../service/BitcoinService'
import Blockchain from '../data/Blockchain'

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
    this.peers.push(peer)
    return this
  },
  countPeers () {
    return this.peers.length
  },
  resetPeers () {
    this.peers = []
  }
}

export default Peer
