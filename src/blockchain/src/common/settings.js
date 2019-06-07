import Money from '../domain/value/Money'

export const MINING_REWARD = Money('jsl', 12.5) // 12.5 jsl reward for miners
export const MAX_NODES = 1 // Allow only 1 node in the network
export const SYNC_TIMER = 10_000 // 10-second intervals in the network
