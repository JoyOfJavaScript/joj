import Document from './data/Document'
import * as Elements from './data/elements'

// Helper function
Document.render = (svgElement, rootHtmlElement) => {
  return (rootHtmlElement.innerHTML = svgElement.render())
}

export default {
  Document,
  ...Elements
}
