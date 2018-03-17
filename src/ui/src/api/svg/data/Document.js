import HasTag from './traits/HasTag'
import HasDimension from './attrs/space/HasDimension'
import CanRender from './traits/CanRender'
import Element from './Element'

const NS = 'http://www.w3.org/2000/svg'
const TAG = 'svg'

const Document = (dimensions, ...children) => {
  const state = {
    viewBox: `0 0 ${dimensions.width} ${dimensions.height}`,
    xmlns: NS
  }
  return Object.assign(
    state,
    Element('doc', children),
    HasTag(TAG),
    HasDimension(dimensions),
    CanRender(state, 'viewBox', 'xmlns')
  )
}

export default Document
