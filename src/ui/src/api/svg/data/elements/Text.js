import HasTag from '../traits/HasTag'
import HasLocation from '../../data/attrs/space/HasLocation'
import CanRender from '../traits/CanRender'
import Element from '../Element'

const TAG = 'text'

// eslint-disable-next-line max-params
const Text = (id, point, fontFamily, fontSize, contents = '') => {
  const state = {
    constructor: Text,
    [Symbol.hasInstance]: i => i.constructor.name === 'Text',
    fontFamily,
    fontSize,
    contents
  }
  const rawTxtChild = {
    render: () => state.contents
  }
  return Object.assign(
    state,
    Element(id, [rawTxtChild]),
    HasTag(TAG),
    HasLocation(point),
    CanRender(state, 'fontFamily', 'fontSize')
  )
}

export default Text
