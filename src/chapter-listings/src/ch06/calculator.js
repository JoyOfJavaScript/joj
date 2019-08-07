/**
 * Sample dummyt module used for unit testing purposes
 */

let feePercent = 0.6

exports.feePercent = feePercent

exports.netTotal = function(funds) {
  return _precisionRound(funds * feePercent, 2)
}

exports.setFeePercent = function(newPercent) {
  feePercent = newPercent
}

function _precisionRound(number, precision) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}
