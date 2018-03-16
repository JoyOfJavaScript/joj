import Document from './svg/data/Document'
import Text from './svg/data/element/Text'

const fetchRootElementName = id =>
  [].slice
    .call(document.getElementsByTagName('script'))
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const root = fetchRootElementName('data-root-id')

// Initialize root element
const rootElement = document.getElementById(root)
rootElement.innerHTML = Document(
  300,
  300,
  Text('a', 0, 35, 'Verdana', 35, '', 'Hello in here!!')
).render()

/**
<svg width="300px" height="300px"
xmlns="http://www.w3.org/2000/svg">
<text x="10" y="50" font-size="30">My SVG</text>
</svg>

*/
