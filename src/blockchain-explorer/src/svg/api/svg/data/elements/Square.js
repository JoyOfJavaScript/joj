import Rectangle from './Rectangle'
import Dimension from '../value/Dimension'

// eslint-disable-next-line max-params
const Square = ({ id, loc, side, roundness, style = '' }) =>
  Object.assign(
    Rectangle({
      id,
      loc,
      dim: Dimension(side, side),
      rx: roundness,
      ry: roundness,
      style
    })
  )
export default Square
