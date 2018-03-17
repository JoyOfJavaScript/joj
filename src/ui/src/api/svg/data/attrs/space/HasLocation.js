const HasLocation = point => ({
  hasLocation: !!point,
  getLocation: () => point,
  get x() {
    return point.x
  },
  get y() {
    return point.y
  }
})
export default HasLocation
