import HasTag from '../traits/HasTag'
import HasLocation from '../../data/attrs/space/HasLocation'
import HasDimension from '../../data/attrs/space/HasDimension'
import CanRender from '../traits/CanRender'
import Element from '../Element'

const TAG = 'rect'

// eslint-disable-next-line max-params
const Rectangle = ({ id, loc, dim, rx, ry, style = '' }) => {
  const state = {
    constructor: Rectangle,
    [Symbol.hasInstance]: i => i.constructor.name === 'Rectangle',
    rx,
    ry,
    style
  }
  return Object.assign(
    state,
    Element(id, []),
    HasTag(TAG),
    HasLocation(loc),
    HasDimension(dim),
    CanRender(state, 'rx', 'ry', 'style')
  )
}

export default Rectangle
