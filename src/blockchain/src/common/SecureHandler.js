import Logger from './Logger.js'

const SecureHandler = maxAttempts => {
  const attemptsRegistry = []
  return {
    apply(target, thisArg, ...args) {
      Logger.trace(`Using secure handler to guard against malicious activity on ${target.name}`)
      const result = Reflect.apply(target, thisArg, ...args)
      if (!result) {
        Logger.warn(`Number of attempts ${attemptsRegistry.length}`)
        if (attemptsRegistry.push(1) > maxAttempts) {
          Logger.error(`Number of exceeded ${attemptsRegistry.length}!`)
          throw new Error('Security violation detected! Halting program!')
        }
      } else {
        // Clear attempts
        attemptsRegistry.length = 0
      }
      return result
    }
  }
}

export default SecureHandler
