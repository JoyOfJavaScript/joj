import HasId from './traits/HasId'
import HasTag from './attrs/space/HasTag'
import HasChildren from './attrs/HasChildren'

const Span = (id, ...children) => {
  const _state = {
    isRoot: false,
  }
  return Object.assign(_state, HasId(id), HasChildren(children), HasTag('span'))
}

export default Span
