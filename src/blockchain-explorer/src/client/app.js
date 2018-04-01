import { SVG } from './api'
import { Maybe } from 'joj-adt'

console.log(Maybe)

const fetchRootElementName = id =>
  Array.from(document.getElementsByTagName('script')) // was: [].slice.call() or [...nodelist]
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const root = fetchRootElementName('data-root-id')

//// Add in chapter, modular library design. Ex the design of Ramda, Rx etc

function App() {
  const state = {
    data: [{ name: 'Luis' }, { name: 'Ana' }, { name: 'Luke' }],
    onClick: handleClick
  }

  const handleClick = event => {
    event.preventDefault()
    console.log(event.target)
  }

  return {
    render() {
      return SVG.Document.render(
        SVG.Document(SVG.Model.Dimension(1000, 180), NamedBoxes(state)),
        document.getElementById(root)
      )
    }
  }
}

App().render()

function NamedBoxes({ data, onClick }) {
  return data.map(({ name }, index) => SquareWithText({ name, index, onClick }))
}

function SquareWithText({ name = 'Anonymous', index = 0, onClick }) {
  const offset = index * 150
  return Group(name, Text(name, offset), Square(name, offset))
}

function Text(name, x) {
  return SVG.Text({
    id: `${name}-label`,
    loc: SVG.Model.Point(x, 50),
    fontFamily: 'Verdana',
    fontSize: 12,
    contents: `Welcome ${name}!!`
  })
}

function Square(name, x) {
  return SVG.Square({
    id: `${name}-rect`,
    loc: SVG.Model.Point(x, 10),
    side: 150,
    roundness: 20,
    style: 'fill:red;stroke:black;stroke-width:5;opacity:0.5'
  })
}

function Group(id, text, rect) {
  return SVG.Group(id, text, rect)
}
