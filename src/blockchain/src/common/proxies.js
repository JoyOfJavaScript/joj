import { curry } from '~util/fp/combinators.js'

// Handlers
const traceLogHandler = {
  get(target, key) {
    console.log(`${new Date()} [TRACE] Calling: `, key)
    return Reflect.get(target, key)
  }
}

const methodCountHandler = names => ({
  get(target, key) {
    if (names.includes(key)) {
      if (!target[key].invocations) {
        target[key].invocations = 0
      }
      target[key].invocations += 1
    }
    return Reflect.get(target, key)
  }
})

// TODO: enhance it to keep an internal map with all counters instead of printing it to the screen
const perfCountHandler = names => {
  return {
    get(target, key) {
      if (names.includes(key)) {
        const start = process.hrtime.bigint()
        const result = Reflect.get(target, key)
        const end = process.hrtime.bigint()
        console.info(`Execution time took ${end - start} nanoseconds`)
        return result
      }
      return Reflect.get(target, key)
    }
  }
}

const weave = curry((handler, target) => {
  return new Proxy(target, handler)
})

const weaveRevocable = curry((handler, target) => {
  return Proxy.revocable(target, handler).proxy
})

// Module
export const TraceLog = weave(traceLogHandler)
export const MethodCounter = (...names) => weave(methodCountHandler(names))
export const PerfCount = (...names) => weaveRevocable(perfCountHandler(names))
