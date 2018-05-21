import HasTag from '../../../shared/attrs/core/HasTag'
import CanRender from '../traits/CanRender'
import Element from '../../../shared/data/Element'

const TAG = 'g'

const Group = (id, ...children) => {
  const state = {
    constructor: Group,
    [Symbol.hasInstance]: i => i.constructor.name === 'Group'
  }

  return Object.assign(
    state,
    Element(id, children || []),
    HasTag(TAG),
    CanRender(state)
  )
}

export default Group
