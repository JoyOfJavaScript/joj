import EventEmitter from 'events'

const MAX_LISTENERS = 1
const SYNC_TIMER = 10 * 60 * 1000 // 10 minutes
const EVENT = 'next_tick'

const Sync = (blockchain, every = SYNC_TIMER) => {
  const loop = new EventEmitter().setMaxListeners(MAX_LISTENERS)
  // Emit an event every SYNC_TIMER minutes
  const LOOP_ID = setTimeout(() => {
    loop.emit('next_tick', blockchain)
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
export default Sync
