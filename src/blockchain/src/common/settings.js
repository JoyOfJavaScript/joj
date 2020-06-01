import Money from '../domain/value/Money.js'

export const MINING_REWARD = Money('₿', 12.5) // 12.5 ₿ reward for miners
export const MAX_NODES = 2 // Allow only 2 nodes in the network
export const SYNC_TIMER = 10_000 // 10-second intervals in the network
