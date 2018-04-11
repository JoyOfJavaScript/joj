import Logger from './Logger'

const LoggerHandler = (...interceptProps) => ({
  get(target, key) {
    if (interceptProps.includes(key)) {
      const value = target[key]
      Logger.trace(`Inspecting property "${key}" with value "${value}"`)
      return value
    }
    return target[key]
  },
})

export default LoggerHandler
