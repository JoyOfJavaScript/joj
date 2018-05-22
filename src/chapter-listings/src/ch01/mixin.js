import { expect } from 'chai'

describe('Object Composition', () => {
  it('Uses reduce with an adder to implement sum', () => {
    const result = [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0)
    expect(result).to.be.equal(15)
  })
  it('Uses Object.assign', () => {
    const Div = Object.assign({}, HasId('myDiv'), HasTag('div'))
    expect(Div.id).to.be.equal('myDiv')
    expect(Div.tag).to.be.equal('div')
    expect(Div.isHtmlTag()).to.be.true
  })
  it('Uses array reduce with spread syntax', () => {
    const compose = (target, ...mixins) =>
      mixins.reduce((a, b) => ({ ...a, ...b }), target)
    const Div = compose({}, HasId('myDiv'), HasTag('div'))
    expect(Div.id).to.be.equal('myDiv')
    expect(Div.tag).to.be.equal('div')
    expect(Div.isHtmlTag()).to.be.true
  })
  it('Uses imperative concat with spread syntax', () => {
    function compose(target, ...mixins) {
      let obj = target
      for (const mixin of mixins) {
        obj = { ...obj, ...mixin }
      }
      return obj
    }
    const Div = compose({}, HasId('myDiv'), HasTag('div'))
    expect(Div.id).to.be.equal('myDiv')
    expect(Div.tag).to.be.equal('div')
    expect(Div.isHtmlTag()).to.be.true
    expect(Div.isSvgTag()).to.be.false
  })
})

// --------------------------------------------------------------//
//                  Mixins used in test                          //
// --------------------------------------------------------------//
const HasId = id => ({
  get id() {
    return id
  },
  isValidId() {
    return id && id.length > 0
  },
})

// Tag dictionary
const dictionary = {
  html: ['html', 'div', 'span', 'label'],
  svg: ['svg', 'g', 'circle', 'rectangle'],
}

const HasTag = name => ({
  get tag() {
    return name.toLowerCase()
  },
  isHtmlTag() {
    return dictionary['html'].includes(name)
  },
  isSvgTag() {
    return dictionary['svg'].includes(name)
  },
  isValid() {
    return [...dictionary['html'], ...dictionary['svg']].includes(name)
  },
})
