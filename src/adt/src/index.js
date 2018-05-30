// For compatibility reasons, needs to be using CommonJS convention
// https://github.com/bookercodes/articles/blob/master/how-to-build-and-publish-es6-npm-modules-today-with-babel.md
export const Maybe = require('./maybe')
export const Combinators = require('./combinators')
export const Result = require('./result')
export const Validation = require('./validation')
export const Conversions = require('./conversions')
export const Pair = require('./pair')

export default {
  Maybe,
  Combinators,
  Result,
  Validation,
  Conversions,
  Pair,
}
