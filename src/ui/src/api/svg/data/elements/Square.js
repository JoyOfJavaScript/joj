import Rectangle from './Rectangle'

// eslint-disable-next-line max-params
const Square = (id, x, y, side, r, style = '') =>
  Object.assign(Rectangle(id, x, y, side, side, r, r, style))

export default Square
