import { SVG } from '../api'

function App(props) {
  let state = {
    blocks: props,
    onClick: handleClick,
  }

  const handleClick = event => {
    event.preventDefault()
    console.log(event.target)
  }

  return {
    render() {
      console.log('rendering', state)
      return SVG.Document(SVG.Model.Dimension(1000, 180), NamedBoxes(state))
    },
    set state(s) {
      console.log('setting state', state)
      state = { ...s, ...state }
    },
  }
}

function NamedBoxes({ blocks, onClick }) {
  return blocks.map(({ name }, index) =>
    SquareWithText({ name, index, onClick })
  )
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
    contents: name,
  })
}

function Square(name, x) {
  console.log(`Adding new square  ${name}`)
  return SVG.Square({
    id: `${name}-rect`,
    loc: SVG.Model.Point(x, 10),
    side: 150,
    roundness: 20,
    style: 'fill:red;stroke:black;stroke-width:5;opacity:0.5',
  })
}

function Group(id, text, rect) {
  return SVG.Group(id, text, rect)
}

export default App
