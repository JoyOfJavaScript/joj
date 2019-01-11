const toOther = sym => M => {
  console.log('sym is', Object.getOwnPropertySymbols(M))
  if (Object.getOwnPropertySymbols(M).includes(sym)) {
    return M[sym]()
  }
  throw new TypeError(
    `Unable to convert ${M.toString()} to a ${sym.toString()} type`
  )
}

export const toValidation = toOther(Symbol.for('validation'))
export const toMaybe = toOther(Symbol.for('maybe'))
