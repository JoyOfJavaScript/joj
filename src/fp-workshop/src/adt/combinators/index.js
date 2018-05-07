'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Function combinators
var identity = function identity(a) {
  return a;
};
var isFunction = function isFunction(a) {
  return a && typeof a === 'function';
};
var compose2 = function compose2(f, g) {
  return function () {
    return f(g.apply(undefined, arguments));
  };
};
var compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return fns.reduce(compose2);
};
var pipe = function pipe() {
  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return fns.reduceRight(compose2);
};
var flatten = function flatten(array) {
  return [].concat.apply([], array);
};
var curry = function curry(fn) {
  return function () {
    for (var _len3 = arguments.length, args1 = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args1[_key3] = arguments[_key3];
    }

    return args1.length === fn.length ? fn.apply(undefined, args1) : function () {
      for (var _len4 = arguments.length, args2 = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args2[_key4] = arguments[_key4];
      }

      var args = [].concat(args1, args2);
      return args.length >= fn.length ? fn.apply(undefined, _toConsumableArray(args)) : curry(fn).apply(undefined, _toConsumableArray(args));
    };
  };
};

// ADT helpers
var map = curry(function (f, M) {
  return M.map(f);
});
var flatMap = curry(function (f, M) {
  return M.flatMap(f);
});
var fold = curry(function (f, M) {
  return M.fold(f);
});

module.exports = {
  isFunction: isFunction,
  curry: curry,
  pipe: pipe,
  compose: compose,
  flatten: flatten,
  identity: identity,
  map: map,
  flatMap: flatMap,
  fold: fold
};