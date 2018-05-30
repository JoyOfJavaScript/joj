//@flow
export type Union<T> = {
  map: (*) => *,
  get: () => T,
  getOrElse: (d: string) => T,
}

export type _Ok<T> = {
  map: (*) => *,
  get: () => T,
  getOrElse: (d: string) => T,
}

export type _Error = {
  map: (*) => *,
  get: Error,
  getOrElse: (d: string) => string,
}

export type _Result<T> = _Ok<T> | _Error
