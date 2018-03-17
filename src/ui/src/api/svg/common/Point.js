/**
 * Money value object
 *
 * @param {string} currency Type of currency (default: bitcoin)
 * @param {string} amount   Amount represented
 * @return {Money} Returns a money object
 */
const Point = (x = 0, y = 0) => ({
  x,
  y,
  constructor: Point,
  equals: other => x === other.x && y === other.y,
  inspect: () => `Point (${x}, ${y})`,
  serialize: () => JSON.stringify({ x, y }),
  [Symbol.toPrimitive]: () => [x, y],
  [Symbol.hasInstance]: i => i.constructor.name === 'Point'
})

Point.ORIGIN = Point()

export default Point
