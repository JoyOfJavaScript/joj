'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Failure = exports.Success = undefined;

var _combinators = require('../combinators');

var _maybe = require('../maybe');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Abstract
var Validation = {
  '@@type': 'Validation',
  '@@implements': ['of', 'map', 'ap', 'fold', 'flatMap', 'bimap', 'merge'],
  of: function of(a) {
    return Success(a);
  }
};

var Success = exports.Success = Validation.Success = function (a) {
  var _Object$assign;

  return Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, Symbol.for('maybe'), function () {
    return (0, _maybe.Just)(a);
  }), _defineProperty(_Object$assign, 'isSuccess', function isSuccess() {
    return true;
  }), _defineProperty(_Object$assign, 'isFailure', function isFailure() {
    return false;
  }), _defineProperty(_Object$assign, 'fold', function fold() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;
    return fn(a);
  }), _defineProperty(_Object$assign, 'foldOrElse', function foldOrElse() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;
    return fn(a);
  }), _defineProperty(_Object$assign, 'map', function map(fn) {
    return Validation.fromNullable(fn(a));
  }), _defineProperty(_Object$assign, 'flatMap', function flatMap(fn) {
    return Validation.fromNullable(fn(a).merge());
  }), _defineProperty(_Object$assign, 'ap', function ap(Va) {
    return Va.isFailure() ? Va : a && (0, _combinators.isFunction)(a) ? Success((0, _combinators.isFunction)(Va.fold()) ? Va.fold().call(Va, a) : a(Va.fold())) : a ? Success(Va.fold().call(Va, a)) : Failure();
  }), _defineProperty(_Object$assign, 'concat', function concat(Va) {
    return Va;
  }), _defineProperty(_Object$assign, 'bifold', function bifold(successTransform, _) {
    return successTransform(a);
  }), _defineProperty(_Object$assign, 'bimap', function bimap(successTransform, _) {
    return Success(successTransform(a));
  }), _defineProperty(_Object$assign, 'merge', function merge() {
    return a;
  }), _defineProperty(_Object$assign, 'getOrElse', function getOrElse(defaultValue) {
    return a;
  }), _defineProperty(_Object$assign, 'toMaybe', function toMaybe() {
    return (0, _maybe.Just)(a);
  }), _defineProperty(_Object$assign, 'toString', function toString() {
    return 'Validation#Success (' + a + ')';
  }), _Object$assign), Validation);
};

var Failure = exports.Failure = Validation.Failure = function (b) {
  var _Object$assign2;

  return Object.assign((_Object$assign2 = {}, _defineProperty(_Object$assign2, Symbol.for('maybe'), function () {
    return (0, _maybe.Nothing)();
  }), _defineProperty(_Object$assign2, 'isSuccess', function isSuccess() {
    return false;
  }), _defineProperty(_Object$assign2, 'isFailure', function isFailure() {
    return true;
  }), _defineProperty(_Object$assign2, 'map', function map(_) {
    return Failure(b);
  }), _defineProperty(_Object$assign2, 'flatMap', function flatMap(_) {
    return Failure(b);
  }), _defineProperty(_Object$assign2, 'ap', function ap(Va) {
    return Va.isFailure() ? Failure(b.concat(Va.merge())) : Failure(b);
  }), _defineProperty(_Object$assign2, 'foldOrElse', function foldOrElse(_, defaultValue) {
    return defaultValue;
  }), _defineProperty(_Object$assign2, 'concat', function concat(Va) {
    return Va.isFailure() ? Failure(b.concat(Va.fold())) : Failure(b);
  }), _defineProperty(_Object$assign2, 'bifold', function bifold(_, failTransform) {
    return failTransform(b);
  }), _defineProperty(_Object$assign2, 'bimap', function bimap(_, failTransform) {
    return Failure(failTransform(b));
  }), _defineProperty(_Object$assign2, 'fold', function fold(_) {
    return errorWith('Unable to fold from a Validate.Failure');
  }), _defineProperty(_Object$assign2, 'merge', function merge() {
    return b;
  }), _defineProperty(_Object$assign2, 'getOrElse', function getOrElse(defaultValue) {
    return defaultValue;
  }), _defineProperty(_Object$assign2, 'toMaybe', function toMaybe() {
    return (0, _maybe.Nothing)();
  }), _defineProperty(_Object$assign2, 'toString', function toString() {
    return 'Validation#Failure (' + b + ')';
  }), _Object$assign2), Validation);
};

var errorWith = function errorWith(str) {
  // This will become more concise with throw expressions (https://github.com/tc39/proposal-throw-expressions)
  throw new TypeError(str);
};

Validation.fromNullable = function (a) {
  for (var _len = arguments.length, errors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    errors[_key - 1] = arguments[_key];
  }

  return a != null ? Success(a) : Failure(errors);
};

Validation.fromMaybe = function (Ma) {
  for (var _len2 = arguments.length, errors = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    errors[_key2 - 1] = arguments[_key2];
  }

  return function () {
    if (Ma['@@type'] === 'Maybe') {
      if (Ma.isJust()) {
        return Success(Ma.fold(function (a) {
          return a;
        }));
      }
      return Failure(errors);
    }
    return Validation.fromNullable(Ma);
  };
};

exports.default = Validation;

module.exports = Validation;