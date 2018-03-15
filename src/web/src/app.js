import { compose } from './util/combinators'

const fetchRootElementName = id =>
  [].slice
    .call(document.getElementsByTagName('script'))
    .filter(s => !!s.getAttribute(id))
    .map(s => s.getAttribute(id))
    .reduce(x => x)

const rootElement = fetchRootElementName('data-root-id')
console.log('Root element is', rootElement)
