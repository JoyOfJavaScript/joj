'use strict';

// For compatibility reasons, needs to be using CommonJS convention
// https://github.com/bookercodes/articles/blob/master/how-to-build-and-publish-es6-npm-modules-today-with-babel.md
module.exports = {
  Maybe: require('./maybe'),
  Validation: require('./validation'),
  Combinators: require('./combinators'),
  Conversions: require('./conversions'),
  Pair: require('./pair')
};