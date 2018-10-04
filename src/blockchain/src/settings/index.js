import Money from '../data/Money'

export const MINING_REWARD = Money('₿', 12.5) // ₿12.5 reward for miners
export const MAX_LISTENERS = 1 // Allow only 1 node
export const SYNC_TIMER = 100 // 10 minutes
export const EVENT = 'mine_blocks' // Event to listen for
