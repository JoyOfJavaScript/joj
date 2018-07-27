import HasChildren from '../../shared/attrs/core/HasChildren'
import HasDimension from './attrs/space/HasDimension'
import CanRender from './traits/CanRender'
import Element from '../../shared/data/Element'

const Document = (dimensions, ...children) => {
  const _state = {
    viewBox: `0 0 ${dimensions.width} ${dimensions.height}`,
    xmlns: 'http://www.w3.org/2000/svg',
  }
  return Object.assign(
    _state,
    Element('doc', 'svg'),
    HasChildren(flatten(children)),
    HasDimension(dimensions),
    CanRender(_state, 'viewBox', 'xmlns')
  )
}

//HasChildren(flatten(children))
const flatten = array => [].concat.apply([], array)

export default Document
