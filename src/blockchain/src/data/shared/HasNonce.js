/**
 * GetNonce mixin.
 * TODO: unit test it
 */
const HasNonce = () => ({
  /**
   * Calculates a random value to be used as nonce
   * @return {Number} Nonce value
   */
  nextNonce () {
    return next()
  }
})

function * next () {
  yield getRandomInteger(1, Infinity)
}

function getRandomInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export default HasNonce
