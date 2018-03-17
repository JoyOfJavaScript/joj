import Document from './data/Document'
import * as Elements from './data/elements'
import * as Values from './data/value'

// Helper function
Document.render = (svgElement, rootHtmlElement) => {
  return (rootHtmlElement.innerHTML = svgElement.render())
}

export default {
  Document,
  ...Elements,
  Model: Values
}
