import { toSvgAttributeName } from '../../common/helper'
import { compose } from '../../common/combinators'

const CanRender = (state, ...keys) => ({
  render: () => {
    const tag = compose(toLower, prop('tag'))(state)
    const loc = renderLoc(state)
    const id = compose(toLower, renderId)(state)
    const attrs = renderCustomAttrs(state, keys)
    const dim = renderDimensions(state)
    return `<${tag} ${id} ${loc} ${dim} ${attrs}>\n${state
      .getChildren()
      .map(c => c.render())
      .join('')}\n</${tag}>`
  }
})

const prop = name => obj => obj[name]

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
