'use strict';

var toOther = function toOther(sym) {
  return function (M) {
    console.log('sym is', Object.getOwnPropertySymbols(M));
    if (Object.getOwnPropertySymbols(M).includes(sym)) {
      return M[sym]();
    }
    throw new TypeError('Unable to convert ' + M.toString() + ' to a ' + sym.toString() + ' type');
  };
};

module.exports = {
  toValidation: toOther(Symbol.for('validation')),
  toMaybe: toOther(Symbol.for('maybe'))
};