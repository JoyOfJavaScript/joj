import { toSvgAttributeName } from '../../common/helper'

const CanRender = (state, ...keys) => ({
  render: () => {
    const tag = state.getTagName()
    const id = state.getId() ? `id="${state.getId()}"` : ''
    const { style, ...attrs } = state
    return `<${tag} ${id} ${keys
      .map(k => `${toSvgAttributeName(k)}="${attrs[k]}"`)
      .join(' ')} style="${style}">\n${state
      .getChildren()
      .map(c => c.render())}\n</${tag}>`
  }
})
export default CanRender
