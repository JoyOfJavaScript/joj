import Point from '../../../common/Point'

const HasLocation = (x, y) => ({
  hasLocation: true,
  getLocation: () => Point(x, y),
  get x() {
    return x
  },
  get y() {
    return y
  }
})
export default HasLocation
