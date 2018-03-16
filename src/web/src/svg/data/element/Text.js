import HasTag from '../traits/HasTag'
import CanRender from '../traits/CanRender'
import Element from '../Element'

const TAG = 'text'

// eslint-disable-next-line max-params
const Text = (id, x, y, fontFamily, fontSize, style = '', contents = '') => {
  const state = {
    x,
    y,
    style,
    fontFamily,
    fontSize
  }
  const rawTxtChild = {
    render: () => contents
  }
  return Object.assign(
    state,
    Element(id, rawTxtChild),
    HasTag(TAG),
    CanRender(state, 'x', 'y', 'style', 'fontFamily', 'fontSize')
  )
}

export default Text
