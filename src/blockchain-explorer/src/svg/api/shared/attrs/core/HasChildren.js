const HasChildren = children => ({
  getChildren: () => clone(children),
  appendChild: element => {
    children.push(element)
  },
  childrenCount: () => children.length
})

const clone = array => array.map(a => a)

export default HasChildren
