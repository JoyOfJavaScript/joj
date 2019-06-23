export let feePercent = 0.6

export function netTotal(funds) {
  return _precisionRound(funds * feePercent, 2)
}

export function setFeePercent(newPercent) {
  feePercent = newPercent
}

function _precisionRound(number, precision) {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}
