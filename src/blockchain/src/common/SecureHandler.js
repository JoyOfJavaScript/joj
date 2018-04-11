const SecureHandler = maxAttempts => {
  const attemptsRegistry = []
  return {
    apply(target, thisArg, ...args) {
      console.log(
        `[INFO] Using secure handler to guard against malicious activity`
      )
      const result = Reflect.apply(target, thisArg, ...args)
      if (!result) {
        console.log(`[WARN] Number of attempts ${attemptsRegistry.length}`)
        if (attemptsRegistry.push(1) > maxAttempts) {
          throw new Error('Security violation detected! Halting program!')
        }
      } else {
        // Clear attempts
        attemptsRegistry.length = 0
      }
      return result
    },
  }
}

export default SecureHandler
