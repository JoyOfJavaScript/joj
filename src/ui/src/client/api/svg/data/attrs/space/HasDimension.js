const HasDimension = dimensions => ({
  hasDimension: !!dimensions,
  get width() {
    return dimensions.width
  },
  get height() {
    return dimensions.height
  }
})
export default HasDimension
