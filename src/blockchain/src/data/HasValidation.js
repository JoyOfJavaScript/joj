import Validation, { Success } from '../../../adt/dist/validation'

/**
 * HasValidation mixin.
 *
 * TODO:
 *
 * @param {CryptoHasher} hasher Hasher used to generate hashes
 * @param {Array}        keys   List of property names present in this object that shall be used for hashing
 * @return {string} Return a string hash of the block
 */
const HasValidation = () => ({
  /**
   * Calcuates whether the items in this container are valid
   *
   * @return {Validation} A validation response
   */
  validate () {
    // Invokes the object's [Symbol.iterator] to enumerate its state through the spread operator
    return this.isValid().flatMap(() =>
      [...this].reduce(
        (v, item) => v.flatMap(() => item.validate()),
        Success(true)
      )
    )
  }
})

export default HasValidation
