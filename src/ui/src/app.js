import { SVG } from './api'

//const { Document, Text } = SVG
//console.log('document', Document)
const fetchRootElementName = id =>
  [].slice
    .call(document.getElementsByTagName('script'))
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const root = fetchRootElementName('data-root-id')

//// Add in chapter, modular library design. Ex the design of Ramda, Rx etc

// Initialize root element
const rootElement = document.getElementById(root)
const data = [{ name: 'Luis' }]
const doc = SVG.Document(400, 180, Names(data))

SVG.Document.render(doc, rootElement)

function Names(props) {
  return props.map(Welcome)
}

function Welcome({ name = 'Anonymous' }) {
  return Group(
    name,
    SVG.Text(`${name}-label`, 60, 50, 'Verdana', 12, `Welcome ${name}!!`),
    SVG.Square(
      `${name}-rect`,
      50,
      20,
      150,
      20,
      'fill:red;stroke:black;stroke-width:5;opacity:0.5'
    )
  )
}

function Group(id, text, rect) {
  return SVG.Group(id, text, rect)
}
