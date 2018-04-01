import Document from './data/Document'
import * as Elements from './data/elements'
import * as Values from './data/value'

// Helper functions
Document.render = (svgElement, rootHtmlElement) => {
  // While Element#innerHTML is considered dangerous,
  // we're accepting it's use here since we control the rendering
  return (rootHtmlElement.innerHTML = svgElement.render())
}

export default {
  Document,
  ...Elements,
  Model: Values
}
