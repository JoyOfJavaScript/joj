const ESC = '\u001B['

export const cursorUp = count =>
  ESC + (typeof count === 'number' ? count : 1) + 'A'

export const cursorDown = count =>
  ESC + (typeof count === 'number' ? count : 1) + 'B'

export default {
  cursorUp
}
