import HasTag from '../attrs/core/HasTag'
import HasId from '../attrs/core/HasId'

/**
 * Base (abstract) element type
 *
 * All SVG elements have an ID attribute as well as zero or more children
 *
 * @param {string} id  SVG id attribute
 * @param {string} tag Element tag
 * @return {Element} Returns an element
 */
const Element = (id, tag) => {
  return Object.assign({}, HasId(id), HasTag(tag))
}

export default Element
