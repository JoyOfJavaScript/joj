import Rectangle from './Rectangle'
import Dimension from '../value/Dimension'

// eslint-disable-next-line max-params
const Square = (id, point, side, r, style = '') =>
  Object.assign(Rectangle(id, point, Dimension(side, side), r, r, style))

export default Square
