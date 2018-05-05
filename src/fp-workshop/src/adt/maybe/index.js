'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Nothing = exports.Just = undefined;

var _combinators = require('../combinators');

var _validation = require('../validation');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Maybe = {
  '@@type': 'Maybe',
  '@@implements': ['of', 'map', 'ap', 'fold', 'flatMap', 'merge'],
  of: function of(a) {
    return Just(a);
  }
};

var Just = exports.Just = Maybe.Just = function (a) {
  var _Object$assign;

  return Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, Symbol.for('validation'), function () {
    return (0, _validation.Success)(a);
  }), _defineProperty(_Object$assign, 'isJust', function isJust() {
    return true;
  }), _defineProperty(_Object$assign, 'isNothing', function isNothing() {
    return false;
  }), _defineProperty(_Object$assign, 'fold', function fold() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;
    return fn(a);
  }), _defineProperty(_Object$assign, 'map', function map(fn) {
    return Maybe.fromNullable(fn(a));
  }), _defineProperty(_Object$assign, 'flatMap', function flatMap(fn) {
    return Maybe.fromNullable(fn(a).merge());
  }), _defineProperty(_Object$assign, 'ap', function ap(Ma) {
    return Ma.isNothing() ? // If applying to a Maybe.Nothing, skip
    Nothing() : // Applying a Maybe.Just
    (0, _combinators.isFunction)(a) ? // If a is a function, look at the contents of Ma
    Maybe.of((0, _combinators.isFunction)(Ma.merge()) ? // If Ma holds another function, fold Ma with a
    Ma.merge().call(Ma, a) : // Ma holds a value, apply that value to a
    a(Ma.merge())) : // a is a value and Ma has a function
    Maybe.of(Ma.merge().call(Ma, a));
  }), _defineProperty(_Object$assign, 'get', function get() {
    return a;
  }), _defineProperty(_Object$assign, 'getOrElse', function getOrElse(_) {
    return a;
  }), _defineProperty(_Object$assign, 'getOrElseThrow', function getOrElseThrow(error) {
    return a;
  }), _defineProperty(_Object$assign, 'orElseThrow', function orElseThrow(error) {
    return Just(a);
  }), _defineProperty(_Object$assign, 'merge', function merge() {
    return a;
  }), _defineProperty(_Object$assign, 'toValidation', function toValidation() {
    return (0, _validation.Success)(a);
  }), _defineProperty(_Object$assign, 'toString', function toString() {
    return 'Maybe#Just (' + a + ')';
  }), _Object$assign), Maybe);
};

var Nothing = exports.Nothing = Maybe.Nothing = function (b) {
  var _Object$assign2;

  return Object.assign((_Object$assign2 = {}, _defineProperty(_Object$assign2, Symbol.for('validation'), function () {
    return (0, _validation.Failure)(['Expected non-null argument']);
  }), _defineProperty(_Object$assign2, 'isJust', function isJust() {
    return false;
  }), _defineProperty(_Object$assign2, 'isNothing', function isNothing() {
    return true;
  }), _defineProperty(_Object$assign2, 'map', function map(_) {
    return Nothing();
  }), _defineProperty(_Object$assign2, 'flatMap', function flatMap(fn) {
    return Nothing();
  }), _defineProperty(_Object$assign2, 'ap', function ap(Ma) {
    return Nothing();
  }), _defineProperty(_Object$assign2, 'fold', function fold(_) {
    return Nothing();
  }), _defineProperty(_Object$assign2, 'get', function get() {
    return errorWith('Unable to get from a Maybe.Nothing');
  }), _defineProperty(_Object$assign2, 'merge', function merge() {
    return errorWith('Unable to merge from a Maybe.Nothing');
  }), _defineProperty(_Object$assign2, 'toValidation', function toValidation() {
    return (0, _validation.Failure)(['Expected non-null argument']);
  }), _defineProperty(_Object$assign2, 'getOrElse', function getOrElse(defaultValue) {
    return defaultValue;
  }), _defineProperty(_Object$assign2, 'getOrElseThrow', function getOrElseThrow(error) {
    throw error;
  }), _defineProperty(_Object$assign2, 'orElseThrow', function orElseThrow(error) {
    throw error;
  }), _defineProperty(_Object$assign2, 'toString', function toString() {
    return 'Maybe#Nothing ()';
  }), _Object$assign2), Maybe);
};

var errorWith = function errorWith(str) {
  // This will become more concise with throw expressions (https://github.com/tc39/proposal-throw-expressions)
  throw new TypeError(str);
};

Maybe.fromNullable = function (a) {
  return a != null ? Just(a) : Nothing();
};
Maybe.fromEmpty = function (a) {
  return Maybe.fromNullable(a).map(function (x) {
    return x.length === 0 ? null : x;
  });
};
Maybe.fromValidation = function (Va) {
  return function () {
    if (Va['@@type'] === 'Validation') {
      if (Va.isSuccess()) {
        return Just(Va.merge());
      }
      return Nothing();
    }
    return Maybe.fromNullable(Va);
  };
};

exports.default = Maybe;

module.exports = Maybe;