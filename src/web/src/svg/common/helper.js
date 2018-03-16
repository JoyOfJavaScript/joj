export const toSvgAttributeName = camelCase =>
  camelCase.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
