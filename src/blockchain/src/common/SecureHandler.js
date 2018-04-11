const MAX_ATTEMPTS = process.env.SECURE_ATTEMPTS || 3

const SecureHandler = attemptsRegistry => {
  return {
    apply(target, thisArg, ...args) {
      console.log(`[INFO] Through secure handler ${args}`)
      const result = Reflect.apply(target, thisArg, ...args)
      if (!result) {
        console.log(`[WARN] Number of attempts ${attemptsRegistry.length}`)
        if (attemptsRegistry.push(1) > MAX_ATTEMPTS) {
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
