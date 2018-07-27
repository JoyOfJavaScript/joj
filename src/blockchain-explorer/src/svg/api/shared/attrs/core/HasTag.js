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

// Tag dictionary
const dictionary = {
  html: ['html', 'div', 'span', 'label'],
  svg: ['svg', 'g', 'circle', 'rectangle'],
}

export default HasTag
