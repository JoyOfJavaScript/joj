import HasTag from './traits/HasTag'
import CanRender from './traits/CanRender'
import Element from './Element'

const NS = 'http://www.w3.org/2000/svg'
const TAG = 'svg'

const Document = (width, height, ...children) => {
  const state = {
    width,
    height,
    style: '',
    viewBox: `0 0 ${width} ${height}`,
    xmlns: NS
  }
  return Object.assign(
    state,
    Element(null, children),
    HasTag(TAG),
    CanRender(state, 'width', 'height', 'viewBox', 'xmlns')
  )
}

export default Document
