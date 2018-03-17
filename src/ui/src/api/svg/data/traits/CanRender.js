import { toSvgAttributeName } from '../../common/helper'

const CanRender = (state, ...keys) => ({
  render: () => {
    const tag = state.getTagName()
    const loc = renderLoc(state)
    const id = renderId(state)
    const attrs = renderCustomAttrs(state, keys)
    const dim = renderDimensions(state)
    return `<${tag} ${id} ${loc} ${dim} ${attrs}>\n${state
      .getChildren()
      .map(c => c.render())
      .join('')}\n</${tag}>`
  }
})

const renderLoc = state =>
  state.hasLocation ? `x="${state.x}" y="${state.y}"` : ''

const renderId = state => (state.getId() ? `id="${state.getId()}"` : '')

const renderCustomAttrs = (state, names) => {
  return names.map(k => `${toSvgAttributeName(k)}="${state[k]}"`).join(' ')
}

const renderDimensions = state =>
  state.hasDimension ? `width="${state.width}" height="${state.height}"` : ''

export default CanRender
