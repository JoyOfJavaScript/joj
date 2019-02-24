// @flow
import ADT from './ADT'

export type ValidationT = {
  isSuccess: () => boolean,
  isFailure: () => boolean,
}

export type SuccessT<T> = ADT<T> & ValidationT
export type FailureT<T> = ADT<T> & ValidationT
