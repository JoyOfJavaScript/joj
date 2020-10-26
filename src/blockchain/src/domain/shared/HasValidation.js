/**
 * HasValidation mixin.
 *
 * @return {Validation} Validation result
 */
const HasValidation = () => ({
  /**
   * Calcuates whether the items in this container are valid, requires enough space for the entire chain and its elements
   *
   * @return {Validation} A validation response
   */
  // validate() {
  //   // Invokes the object's [Symbol.iterator] to enumerate its state through the spread operator
  //   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator    
  //   return [...this]
  //     .map(item => item.validate())
  //     .reduce(
  //       (validationResult, nextValidation) => validationResult.flatMap(() => nextValidation), this.isValid()
  //     )
  // }
  /**
   * Calcuates whether the items in this container are valid recursively. Would require tail-call optimization
   *
   * @return {Validation} A validation response
   */
  validate() {
    return validateModel(this)
  }

  // /**
  //  * Imperative approach
  //  *
  //  * @return {Validation} A validation response
  //  */
  // validate() {
  //   return validateModel(this)
  // }
})

function validateModel(model) {
  let result = model.isValid();
  for (const element of model) {
    result = validateModel(element);
    if (result.isFailure) {
      break;
    }
  }
  return result;
}

export default HasValidation
