//@flow
//Inspired in: https://github.com/gcanti/flow-static-land
export type _ADT<T> = {
  fold: <T2>(f: (a: T) => T2) => T2,
  map: <T2>(f: (a: T) => T2) => _ADT<T2>,
  flatMap: <T2>(f: (a: T) => _ADT<T2>) => _ADT<T2>,
  ap: <T2>(f: (a: _ADT<(a: T) => T2>) => _ADT<T2>) => _ADT<T2>,
  get: () => T,
  getOrElse: any => any, // Using 'any' so that the return value can flow into any type
  toString: () => string,
}
