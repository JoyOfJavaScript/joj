const HasDimension = (w, h) => ({
  hasDimension: true,
  get width() {
    return w
  },
  get height() {
    return h
  }
})
export default HasDimension
