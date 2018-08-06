export const isUpKey = key =>
  key.name === 'up' || key.name === 'k' || (key.name === 'p' && key.ctrl)

export const isDownKey = key =>
  key.name === 'down' || key.name === 'j' || (key.name === 'n' && key.ctrl)

export const isKillSequence = key => key.ctrl && key.name === 'c'

export default {
  isUpKey,
  isDownKey,
  isKillSequence
}
