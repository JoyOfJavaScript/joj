'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = exports.typeOf = exports.is = undefined;

var _combinators = require('../combinators');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Test whether some value is of type ctor
 *
 * @param {Type}   ctor  Any JavaScript type (Object | Function | Array | Number | String)
 * @param {Object} val   Any value
 * @return {boolean} True or false whether the value's type constructor matches
 */
var is = exports.is = function is(ctor) {
  return function (val) {
    return val != null && val.constructor === ctor || val instanceof ctor;
  };
};

var fork = function fork(join, func1, func2) {
  return function (val) {
    return join(func1(val), func2(val));
  };
};

var type = function type(val) {
  return val === null ? 'Null' : !val ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
};

var tap = function tap(fn) {
  return function (x) {
    fn(x);
    return x;
  };
};

// Use either?
var typeErr = (0, _combinators.curry)(function (name, cond) {
  if (!cond) {
    throw new TypeError('Wrong type used: ' + name);
  }
  return cond;
});

// Checks if the provided object of type T
// typeOf :: T -> a -> a | Error
var typeOf = exports.typeOf = function typeOf(T) {
  return tap(fork(typeErr, type, is(T)));
};

// Typed 2-tuple (Pair)
// Pair :: (A, B) -> (a, b) -> Object
var Pair = exports.Pair = function Pair(A, B) {
  return function (l, r) {
    return function (left, right) {
      var _ref;

      return _ref = {
        left: left,
        right: right,
        constructor: Pair
      }, _defineProperty(_ref, Symbol.iterator, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return left;

              case 2:
                _context.next = 4;
                return right;

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      })), _defineProperty(_ref, 'bimap', function bimap(C, D) {
        return function (f, g) {
          return Pair(C, D)(f(left), g(right));
        };
      }), _defineProperty(_ref, 'mergeMap', function mergeMap(C) {
        return function (f) {
          return Pair(C, C)(f(left), f(right));
        };
      }), _defineProperty(_ref, 'foldL', function foldL(f) {
        var _ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _combinators.identity;

        return f((0, _combinators.identity)(left));
      }), _defineProperty(_ref, 'foldR', function foldR() {
        var _ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;

        var g = arguments[1];
        return g((0, _combinators.identity)(right));
      }), _defineProperty(_ref, 'merge', function merge(f) {
        return f(left, right);
      }), _defineProperty(_ref, 'equals', function equals(otherPair) {
        return left === otherPair.left && right === otherPair.right;
      }), _defineProperty(_ref, 'inspect', function inspect() {
        return 'Pair [' + left + ', ' + right + ']';
      }), _defineProperty(_ref, 'toArray', function toArray() {
        return [left, right];
      }), _defineProperty(_ref, Symbol.toPrimitive, function (hint) {
        return console.log('As primitive', hint) + hint === 'string' ? 'Pair [' + left + ', ' + right + ']' : [left, right];
      }), _ref;
    }(
    // Check that objects passed into this tuple are the right type
    typeOf(A)(l), typeOf(B)(r));
  };
};

Pair['@@implements'] = ['mergeMap', 'bimap', 'chain', 'merge', 'foldL', 'foldR', 'equals'];

Pair.TYPE = Pair(String, String)('', '');
Pair['@@type'] = 'Pair';

exports.default = Pair;

module.exports = Pair;