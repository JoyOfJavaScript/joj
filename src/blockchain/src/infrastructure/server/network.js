import { EVENT, MAX_LISTENERS, SYNC_TIMER } from '../settings'
import EventEmitter from 'events'

const Network = (blockchain, every = SYNC_TIMER) => {
  const loop = new EventEmitter().setMaxListeners(MAX_LISTENERS)
  // Emit an event every SYNC_TIMER minutes
  const LOOP_ID = setInterval(() => {
    loop.emit(EVENT, blockchain)
  }, every)
  return {
    unsubscribe: () => {
      // Stop the interval
      if (LOOP_ID >= 0) {
        clearInterval(LOOP_ID)
        // Remove all listeners
        loop.removeAllListeners()
      }
    },
    subscribe: listener => {
      loop.on(EVENT, listener)
    }
  }
}
export default Network
