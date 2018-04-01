import { toSvgAttributeName } from '../../common/helper'
import { compose } from '../../common/combinators'

/**
 * Used to render the basic structure of an SVG element
 *
 * </name id [attrs] style>
 *   <children>
 * </name>
 */
const CanRender = (state, ...keys) => ({
  render: () => {
    const tag = state.tag
    const loc = renderLoc(state)
    const id = renderId(state)
    const attrs = renderCustomAttrs(state, keys)
    const dim = renderDimensions(state)
    return format`<${tag} ${id} ${loc} ${dim} ${attrs}>
${state
      .getChildren()
      .map(c => c.render())
      .join('')}
</${tag}>`
  }
})

// eslint-disable-next-line max-params
const format = (str, tagExp, idExp, locExp, dimExp, attrsExp, childExp) => {
  idExp = toLower(idExp)
  tagExp = toLower(tagExp)
  return (
    str[0] +
    [tagExp, idExp, locExp, dimExp, attrsExp].join(' ') +
    str[5] +
    childExp +
    str[6] +
    tagExp +
    str[7]
  )
}

const toLower = str => str.toLowerCase()

const renderLoc = state =>
  state.hasLocation ? `x="${state.x}" y="${state.y}"` : ''

const renderId = state => (state.id ? `id="${state.id}"` : '')

const renderCustomAttrs = (state, names) => {
  return names.map(k => `${toSvgAttributeName(k)}="${state[k]}"`).join(' ')
}

const renderDimensions = state =>
  state.hasDimension ? `width="${state.width}" height="${state.height}"` : ''

export default CanRender
