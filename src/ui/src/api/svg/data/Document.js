import HasTag from './traits/HasTag'
import HasDimension from './attrs/core/HasDimension'
import CanRender from './traits/CanRender'
import Element from './Element'

const NS = 'http://www.w3.org/2000/svg'
const TAG = 'svg'

const Document = (width, height, ...children) => {
  const state = {
    viewBox: `0 0 ${width} ${height}`,
    xmlns: NS
  }
  return Object.assign(
    state,
    Element('doc', children),
    HasTag(TAG),
    HasDimension(width, height),
    CanRender(state, 'viewBox', 'xmlns')
  )
}

export default Document
