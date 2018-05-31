//@flow
import type { _ADT } from '..'

export type _Result = {
  isOk: () => boolean,
  isError: () => boolean,
}

export type _Ok<T> = _ADT<T> & _Result
export type _Error<T> = _ADT<T> & _Result
