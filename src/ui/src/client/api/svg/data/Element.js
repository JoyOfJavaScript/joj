import HasChildren from './traits/HasChildren'
import HasId from './attrs/core/HasId'

/**
 * Base (abstract) element type
 *
 * All SVG elements have an ID attribute as well as zero or more children
 *
 * @param {string} id        SVG id attribute
 * @param {Array}  children  Nested children SVG elements
 * @return {Element} Returns an element
 */
const Element = (id, children) => {
  return Object.assign({}, HasId(id), HasChildren(flatten(children)))
}

const flatten = array => [].concat.apply([], array)

export default Element
