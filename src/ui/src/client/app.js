import { SVG } from './api'
import { Maybe } from 'joj-adt'

console.log(Maybe)

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
const data = [{ name: 'Luis' }, { name: 'Ana' }, { name: 'Luke' }]
const doc = SVG.Document(SVG.Model.Dimension(1000, 180), Names(data))
SVG.Document.render(doc, rootElement)

function Names(props) {
  return props.map((name, index) => WelcomeBox({ ...name, index }))
}

function WelcomeBox({ name = 'Anonymous', index = 0 }) {
  const offset = index * 150
  return Group(
    name,
    SVG.Text(
      `${name}-label`,
      SVG.Model.Point(offset, 50),
      'Verdana',
      12,
      `Welcome ${name}!!`
    ),
    squareAt(name, offset)
  )
}

function squareAt(name, x) {
  return SVG.Square(
    `${name}-rect`,
    SVG.Model.Point(x, 10),
    150,
    20,
    'fill:red;stroke:black;stroke-width:5;opacity:0.5'
  )
}

function Group(id, text, rect) {
  return SVG.Group(id, text, rect)
}
