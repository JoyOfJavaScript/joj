const LoggerHandler = (...interceptProps) => ({
  get(target, key) {
    if (interceptProps.includes(key)) {
      const value = target[key]
      console.log(`[TRACE] Inspecting property "${key}" with value "${value}"`)
      return value
    }
    return target[key]
  },
})

export default LoggerHandler
