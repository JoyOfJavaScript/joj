import { Success } from '../../lib/fp/data/validation'

/**
 * HasValidation mixin.
 *
 * @return {Validation} Validation result
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
      // The spread operator invokes [Symbol.iterator]
      [...this].reduce(
        (v, item) => v.flatMap(() => item.validate()),
        Success(true)
      )
    )
  }
})

export default HasValidation
