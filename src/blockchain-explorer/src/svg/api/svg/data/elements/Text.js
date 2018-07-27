import HasTag from '../../../shared/attrs/core/HasTag'
import HasLocation from '../../data/attrs/space/HasLocation'
import CanRender from '../traits/CanRender'
import Element from '../../../shared/data/Element'
import { curry } from '../../common/combinators'

const TAG = 'text'

const Text = ({ id, loc, fontFamily, fontSize, contents = '' }) => {
  const state = {
    fontFamily,
    fontSize,
    contents,
    render: {}
  }
  const rawTxtChild = {
    render: () => escapeContents(document, state.contents)
  }

  return Object.assign(
    state,
    Element(id, [rawTxtChild]),
    HasTag(TAG),
    HasLocation(loc),
    CanRender(state, 'fontFamily', 'fontSize')
  )
}

// Use the browser's built-in functionality to quickly and safely escape
// the string
const escapeContents = curry(
  (document, str) => str // TODO: Finish
)

export default Text
