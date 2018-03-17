/**
 * Dimension value object
 *
 * @param {number} w Width
 * @param {number} h Height
 * @return {Dimension} Returns a Dimension object
 */
const Dimension = (w = 1, h = 1) => ({
  width: w,
  height: h,
  constructor: Dimension,
  equals: other => w === other.width && h === other.height,
  inspect: () => `Dimension (${w}, ${h})`,
  serialize: () => JSON.stringify({ w, h }),
  [Symbol.toPrimitive]: () => [w, h],
  [Symbol.hasInstance]: i => i.constructor.name === 'Dimension'
})

export default Dimension
