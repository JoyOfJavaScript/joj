import Functor from '../contract/Functor.js'

export default class Id {
  #tag = 'ID'
  #val
  constructor(value) {
    this.#val = value
  }

  get value() {
    return this.#val
  }

  /**
   * Type lifting
   *
   * @param {Object} value Any value
   * @return {Id} Wrapped value
   */
  static of(value) {
    return new Id(value)
  }

  get() {
    return this.#val
  }

  get [Symbol.for('implements')]() {
    return ['map']
  }

  get tag() {
    return this.#tag
  }

  toString() {
    return `${this.tag} (${this.value})`
  }
}

Object.assign(Id.prototype, Functor)
