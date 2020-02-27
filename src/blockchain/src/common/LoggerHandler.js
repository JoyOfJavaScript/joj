import Logger from './Logger.js'

const LoggerHandler = (...interceptProps) => ({
  get(target, key) {
    if (interceptProps.includes(key) && key in target) {
      const value = target[key]
      Logger.trace(`Inspecting property "${key}" with value "${value}"`)
      return value
    }
    return target[key]
  }
})

export default LoggerHandler
