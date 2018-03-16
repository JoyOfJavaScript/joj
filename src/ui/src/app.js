import { SVG } from './api'

const fetchRootElementName = id =>
  [].slice
    .call(document.getElementsByTagName('script'))
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const root = fetchRootElementName('data-root-id')

// Initialize root element
const rootElement = document.getElementById(root)
rootElement.innerHTML = SVG.Document(
  300,
  300,
  Welcome({ name: 'Luis' })
).render()

function Welcome(props) {
  return SVG.Text('a', 0, 35, 'Verdana', 35, '', `Welcome ${props.name}!!`)
}

// const Welcome = Object.create(Text('a', 0, 35, 'Verdana', 35))
// Welcome.__proto__.contents = 'Welcome Luis!!'
// console.log('Welcome __proto__', Welcome.__proto__)
//
// class W extends Text {
//   constructor() {
//     super('a', 0, 35, 'Verdana', 35, '', 'Here')
//   }
//   render() {
//     console.log('in this render!!!!')
//     return `<text x="10" y="50" font-size="30">My SVG</text>`
//   }
// }
//
// const w = new W()
// console.log(w.render())
// console.log('w is', w)

// rootElement.innerHTML = Document(300, 300, w).render()

/**

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

<svg width="300px" height="300px"
xmlns="http://www.w3.org/2000/svg">
<text x="10" y="50" font-size="30">My SVG</text>
</svg>

*/
