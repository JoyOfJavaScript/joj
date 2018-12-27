import Money from '../data/value/Money'

export const MINING_REWARD = Money('₿', 12.5) // ₿12.5 reward for miners
export const MAX_LISTENERS = 1 // Allow only 1 node
export const SYNC_TIMER = 1000 * 10 // 10 seconds
export const EVENT = 'mine_blocks' // Event to listen for
