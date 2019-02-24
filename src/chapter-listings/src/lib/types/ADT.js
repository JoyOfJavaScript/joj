// @flow
// Inspired in: https://github.com/gcanti/flow-static-land
export type ADT<T> = {
  fold: <T2>(f: (a: T) => T2) => T2,
  map: <T2>(f: (a: T) => T2) => ADT<T2>,
  flatMap: <T2>(f: (a: T) => ADT<T2>) => ADT<T2>,
  ap: <T2>(f: (a: ADT<(a: T) => T2>) => ADT<T2>) => ADT<T2>,
  get: () => T,
  getOrElse: any => any, // Using 'any' so that the return value can flow into any type
  toString: () => string,
}
