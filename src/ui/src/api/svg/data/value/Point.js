/**
 * Money value object
 *
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @return {Point} Returns a Point object
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
